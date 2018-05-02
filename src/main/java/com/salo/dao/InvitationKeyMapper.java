package com.salo.dao;

import com.salo.model.InvitationKey;
import com.salo.model.InvitationKeyExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface InvitationKeyMapper {
    long countByExample(InvitationKeyExample example);

    int deleteByExample(InvitationKeyExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(InvitationKey record);

    int insertSelective(InvitationKey record);

    List<InvitationKey> selectByExample(InvitationKeyExample example);

    InvitationKey selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") InvitationKey record, @Param("example") InvitationKeyExample example);

    int updateByExample(@Param("record") InvitationKey record, @Param("example") InvitationKeyExample example);

    int updateByPrimaryKeySelective(InvitationKey record);

    int updateByPrimaryKey(InvitationKey record);
}