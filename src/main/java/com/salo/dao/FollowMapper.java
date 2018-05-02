package com.salo.dao;

import com.salo.model.FollowExample;
import com.salo.model.FollowKey;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface FollowMapper {
    long countByExample(FollowExample example);

    int deleteByExample(FollowExample example);

    int deleteByPrimaryKey(FollowKey key);

    int insert(FollowKey record);

    int insertSelective(FollowKey record);

    List<FollowKey> selectByExample(FollowExample example);

    int updateByExampleSelective(@Param("record") FollowKey record, @Param("example") FollowExample example);

    int updateByExample(@Param("record") FollowKey record, @Param("example") FollowExample example);
}