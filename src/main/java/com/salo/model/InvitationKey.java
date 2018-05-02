package com.salo.model;

public class InvitationKey {
    private Integer id;

    private String invitationkey;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getInvitationkey() {
        return invitationkey;
    }

    public void setInvitationkey(String invitationkey) {
        this.invitationkey = invitationkey == null ? null : invitationkey.trim();
    }
}