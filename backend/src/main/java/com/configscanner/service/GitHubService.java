package com.configscanner.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class GitHubService {

    public String downloadRepository(String repoUrl) throws IOException {
        // Convert "https://github.com/user/repo" to
        // "https://github.com/user/repo/archive/refs/heads/main.zip"
        // Handling basic main/master assumption.
        // A more robust way is to use the API to find the default branch, but for this
        // MVP:

        String cleanUrl = repoUrl.endsWith(".git") ? repoUrl.substring(0, repoUrl.length() - 4) : repoUrl;

        // Create temp directory
        Path tempDir = Files.createTempDirectory("github_scan_");
        File zipFile = new File(tempDir.toFile(), "repo.zip");

        // Try 'main' first, then 'master'
        boolean downloaded = downloadZip(cleanUrl + "/archive/refs/heads/main.zip", zipFile);
        if (!downloaded) {
            downloaded = downloadZip(cleanUrl + "/archive/refs/heads/master.zip", zipFile);
        }

        if (!downloaded) {
            throw new IOException("Could not download repository. Check URL or ensure it's public.");
        }

        // Unzip
        unzip(zipFile.getAbsolutePath(), tempDir.toFile().getAbsolutePath());

        return tempDir.toFile().getAbsolutePath();
    }

    private boolean downloadZip(String urlString, File destination) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            if (connection.getResponseCode() != 200) {
                return false;
            }

            try (InputStream in = connection.getInputStream()) {
                Files.copy(in, destination.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void unzip(String zipFilePath, String destDir) throws IOException {
        File dir = new File(destDir);
        if (!dir.exists())
            dir.mkdirs();

        byte[] buffer = new byte[1024];
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                File newFile = newFile(dir, zipEntry);
                if (zipEntry.isDirectory()) {
                    if (!newFile.isDirectory() && !newFile.mkdirs()) {
                        throw new IOException("Failed to create directory " + newFile);
                    }
                } else {
                    File parent = newFile.getParentFile();
                    if (!parent.isDirectory() && !parent.mkdirs()) {
                        throw new IOException("Failed to create directory " + parent);
                    }
                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zipEntry = zis.getNextEntry();
            }
            zis.closeEntry();
        }
    }

    private File newFile(File destinationDir, ZipEntry zipEntry) throws IOException {
        File destFile = new File(destinationDir, zipEntry.getName());
        String destDirPath = destinationDir.getCanonicalPath();
        String destFilePath = destFile.getCanonicalPath();

        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
        }

        return destFile;
    }
}
