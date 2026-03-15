package com.likelion.last.domain.document.repository;

import com.likelion.last.domain.document.entity.Document;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByName(String name);
}
