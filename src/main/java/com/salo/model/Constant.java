package com.salo.model;

public class Constant {
    private Integer authid;

    private String authrst;

    public Integer getAuthid() {
        return authid;
    }

    public void setAuthid(Integer authid) {
        this.authid = authid;
    }

    public String getAuthrst() {
        return authrst;
    }

    public void setAuthrst(String authrst) {
        this.authrst = authrst == null ? null : authrst.trim();
    }
}