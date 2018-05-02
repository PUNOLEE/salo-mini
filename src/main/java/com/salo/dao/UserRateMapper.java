package com.salo.dao;

import com.salo.model.UserRate;
import com.salo.model.UserRateExample;
import com.salo.model.UserRateKey;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface UserRateMapper {
    long countByExample(UserRateExample example);

    int deleteByExample(UserRateExample example);

    int deleteByPrimaryKey(UserRateKey key);

    int insert(UserRate record);

    int insertSelective(UserRate record);

    List<UserRate> selectByExample(UserRateExample example);

    UserRate selectByPrimaryKey(UserRateKey key);

    int updateByExampleSelective(@Param("record") UserRate record, @Param("example") UserRateExample example);

    int updateByExample(@Param("record") UserRate record, @Param("example") UserRateExample example);

    int updateByPrimaryKeySelective(UserRate record);

    int updateByPrimaryKey(UserRate record);
}