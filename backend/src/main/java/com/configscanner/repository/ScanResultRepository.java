package com.configscanner.repository;

import com.configscanner.model.ScanResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanResultRepository extends MongoRepository<ScanResult, String> {
    List<ScanResult> findByProjectName(String projectName);
}
