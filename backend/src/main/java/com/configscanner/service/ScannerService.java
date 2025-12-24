package com.configscanner.service;

import com.configscanner.model.Issue;
import com.configscanner.model.ScanResult;
import com.configscanner.repository.ScanResultRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import java.util.regex.Pattern;
import java.util.stream.Stream;

@Service
public class ScannerService {

    @Autowired
    private ScanResultRepository scanResultRepository;

    // --- DETECTION PATTERNS ---
    private static final Pattern AWS_KEY_PATTERN = Pattern.compile("AKIA[0-9A-Z]{16}");
    // Made quotes optional for generic secrets
    private static final Pattern GENERIC_SECRET_PATTERN = Pattern
            .compile("(?i)(api[_-]?key|secret|token).{0,10}['\"]?([a-zA-Z0-9-]{20,})['\"]?");

    // Security Misconfigurations
    // Made quotes optional for true/false values
    private static final Pattern DEBUG_ENABLED = Pattern.compile("(?i)(debug|show-sql)\\s*[:=]\\s*['\"]?true['\"]?");
    private static final Pattern SSL_DISABLED = Pattern.compile("(?i)ssl\\s*[:=]\\s*['\"]?false['\"]?");
    private static final Pattern ALLOW_ALL_ORIGINS = Pattern.compile("(?i)allowAllOrigins\\s*[:=]\\s*['\"]?true['\"]?");

    // Weak Credentials
    private static final Pattern WEAK_PASSWORD = Pattern
            .compile("(?i)password\\s*[:=]\\s*['\"]?(admin|123456|password)['\"]?");
    private static final Pattern ROOT_USER = Pattern.compile("(?i)username\\s*[:=]\\s*['\"]?root['\"]?");

    // Sensitive Files
    private static final Set<String> SENSITIVE_FILES = Set.of(".env", ".env.local", "application-dev.yml");

    public ScanResult scanProject(String projectPath, String projectName) {
        List<Issue> issues = new ArrayList<>();

        try (Stream<Path> paths = Files.walk(Paths.get(projectPath))) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> !isIgnoredFile(path.toFile()))
                    .forEach(path -> {
                        scanFile(path.toFile(), issues);
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }

        ScanResult result = new ScanResult();
        result.setProjectName(projectName);
        result.setScanType("LOCAL");
        result.setTimestamp(LocalDateTime.now());
        result.setIssues(issues);
        result.setTotalIssues(issues.size());
        result.setStatus(issues.isEmpty() ? "SUCCESS" : "WARNING");

        return scanResultRepository.save(result);
    }

    private boolean isIgnoredFile(File file) {
        String name = file.getName().toLowerCase();
        String absPath = file.getAbsolutePath();

        // Check for Sensitive Files first - if found, we WANT to scan/report them, but
        // as a file-level issue
        if (SENSITIVE_FILES.contains(name)) {
            return false; // Do not ignore, we need to catch it inside scanFile
        }

        // Ignore specific directories by path to avoid false positives on filenames
        // We use File.separator to ensure we match directories, not just substrings
        if (absPath.contains(File.separator + ".git" + File.separator) ||
                absPath.contains(File.separator + "node_modules" + File.separator) ||
                absPath.contains(File.separator + "target" + File.separator)) {
            return true;
        }

        return name.endsWith(".class") ||
                name.endsWith(".jar") ||
                name.endsWith(".save") ||
                name.endsWith(".log") ||
                name.endsWith(".png") ||
                name.endsWith(".jpg") ||
                name.endsWith(".exe") ||
                name.endsWith(".dll");
    }

    private void scanFile(File file, List<Issue> issues) {
        String fileName = file.getName();

        // 1. Check for Sensitive File Exposure
        if (SENSITIVE_FILES.contains(fileName)) {
            issues.add(new Issue("SENSITIVE_FILE", file.getAbsolutePath(), 0,
                    "Sensitive environment file detected. Should not be in version control.", "HIGH", fileName));
        }

        try {
            List<String> lines = Files.readAllLines(file.toPath());
            String fullContent = String.join("\n", lines);

            // 2. Scan Lines for Secrets and Misconfigurations
            for (int i = 0; i < lines.size(); i++) {
                String line = lines.get(i);
                checkLine(line, file.getAbsolutePath(), i + 1, issues);
            }

            // 3. Scan for Missing Configuration (Only for config files)
            if (fileName.contains("application") || fileName.endsWith(".properties") || fileName.endsWith(".yml")
                    || fileName.endsWith(".yaml")) {
                checkMissingConfig(fullContent, file.getAbsolutePath(), issues);
            }

        } catch (IOException e) {
            // Ignore binary read errors or empty files
        }

        // 4. Structural Validation
        if (fileName.endsWith(".json")) {
            validateJson(file, issues);
        } else if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) {
            validateYaml(file, issues);
        }
    }

    private void checkLine(String line, String filePath, int lineNumber, List<Issue> issues) {
        // Secrets
        if (AWS_KEY_PATTERN.matcher(line).find()) {
            issues.add(new Issue("SECRET", filePath, lineNumber, "AWS Access Key identified", "CRITICAL", "AKIA..."));
        }
        if (GENERIC_SECRET_PATTERN.matcher(line).find()) {
            issues.add(
                    new Issue("SECRET", filePath, lineNumber, "Potential API Key/Token identified", "HIGH", "******"));
        }

        // Security Misconfigurations
        if (DEBUG_ENABLED.matcher(line).find()) {
            issues.add(new Issue("SECURITY_MISCONFIG", filePath, lineNumber,
                    "Debug mode enabled (debug=true) is unsafe for production", "HIGH", "debug=true"));
        }
        if (SSL_DISABLED.matcher(line).find()) {
            issues.add(new Issue("SECURITY_MISCONFIG", filePath, lineNumber, "SSL is disabled (ssl=false)", "HIGH",
                    "ssl=false"));
        }
        if (ALLOW_ALL_ORIGINS.matcher(line).find()) {
            issues.add(new Issue("SECURITY_MISCONFIG", filePath, lineNumber, "CORS allowAllOrigins is enabled", "HIGH",
                    "allowAllOrigins"));
        }

        // Weak Credentials
        if (WEAK_PASSWORD.matcher(line).find()) {
            issues.add(new Issue("WEAK_CREDENTIALS", filePath, lineNumber, "Weak or default password detected", "HIGH",
                    "password=..."));
        }
        if (ROOT_USER.matcher(line).find()) {
            issues.add(new Issue("WEAK_CREDENTIALS", filePath, lineNumber, "Running as root user is not recommended",
                    "HIGH", "username=root"));
        }
    }

    private void checkMissingConfig(String content, String filePath, List<Issue> issues) {
        if (!content.contains("db.username") && !content.contains("spring.datasource.username")) {
            issues.add(new Issue("MISSING_CONFIG", filePath, 0, "Missing Database Username configuration", "MEDIUM",
                    "db.username"));
        }
        if (!content.contains("db.password") && !content.contains("spring.datasource.password")) {
            issues.add(new Issue("MISSING_CONFIG", filePath, 0, "Missing Database Password configuration", "MEDIUM",
                    "db.password"));
        }
        if (!content.contains("server.port")) {
            issues.add(new Issue("MISSING_CONFIG", filePath, 0, "Missing Server Port definition (defaults to 8080)",
                    "MEDIUM", "server.port"));
        }
    }

    private void validateJson(File file, List<Issue> issues) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            mapper.readTree(file);
        } catch (IOException e) {
            issues.add(new Issue("CONFIG_ERROR", file.getAbsolutePath(), 0, "Invalid JSON structure: " + e.getMessage(),
                    "MEDIUM", "JSON Parse Error"));
        }
    }

    private void validateYaml(File file, List<Issue> issues) {
        Yaml yaml = new Yaml();
        try {
            yaml.load(Files.newInputStream(file.toPath()));
        } catch (Exception e) {
            issues.add(new Issue("CONFIG_ERROR", file.getAbsolutePath(), 0, "Invalid YAML structure: " + e.getMessage(),
                    "MEDIUM", "YAML Parse Error"));
        }
    }

    public List<ScanResult> getAllHistory() {
        return scanResultRepository.findAll();
    }
}
