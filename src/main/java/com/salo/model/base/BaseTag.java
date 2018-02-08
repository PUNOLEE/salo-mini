package com.salo.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseTag<M extends BaseTag<M>> extends Model<M> implements IBean {

	public M setTagId(java.lang.Integer tagId) {
		set("tagId", tagId);
		return (M)this;
	}
	
	public java.lang.Integer getTagId() {
		return getInt("tagId");
	}

	public M setTagName(java.lang.String tagName) {
		set("tagName", tagName);
		return (M)this;
	}
	
	public java.lang.String getTagName() {
		return getStr("tagName");
	}

}
