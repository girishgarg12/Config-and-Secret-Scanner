package com.configscanner.model;

public class Issue {
    private String type; // SECRET or CONFIG_ERROR
    private String filePath;
    private int lineNumber;
    private String description;
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String matchedContent; // The actual secret or error found (masked if secret)

    public Issue() {
    }

    public Issue(String type, String filePath, int lineNumber, String description, String severity,
            String matchedContent) {
        this.type = type;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.description = description;
        this.severity = severity;
        this.matchedContent = matchedContent;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getMatchedContent() {
        return matchedContent;
    }

    public void setMatchedContent(String matchedContent) {
        this.matchedContent = matchedContent;
    }
}
