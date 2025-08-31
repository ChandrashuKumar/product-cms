-- Products Management CMS Database Schema
-- Run this script in your MariaDB/MySQL database

CREATE DATABASE IF NOT EXISTS product_cms;
USE product_cms;

CREATE TABLE IF NOT EXISTS Products (
    product_id      INT AUTO_INCREMENT PRIMARY KEY,
    product_name    VARCHAR(100) NOT NULL,
    product_desc    TEXT,
    status          ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
    
    -- Audit Columns
    created_by      VARCHAR(50) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(50),
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted      BOOLEAN DEFAULT FALSE,
    
    -- Indexes for better performance
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_is_deleted (is_deleted)
);

-- Insert sample data
INSERT INTO Products (product_name, product_desc, created_by, status) VALUES 
('Product A', 'Description for Product A', 'admin', 'Draft'),
('Product B', 'Description for Product B', 'admin', 'Published');