package com.kredent.backend.dto;

/** One entry in the department catalog (GET /api/admin/departments), with a real, DB-computed student count. */
public class DepartmentResponse {

    private String code;
    private String label;
    private long studentCount;

    public DepartmentResponse() {
    }

    public DepartmentResponse(String code, String label, long studentCount) {
        this.code = code;
        this.label = label;
        this.studentCount = studentCount;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(long studentCount) {
        this.studentCount = studentCount;
    }
}
