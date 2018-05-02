package com.salo.dao;

import com.salo.model.Constant;
import com.salo.model.ConstantExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ConstantMapper {
    long countByExample(ConstantExample example);

    int deleteByExample(ConstantExample example);

    int deleteByPrimaryKey(Integer authid);

    int insert(Constant record);

    int insertSelective(Constant record);

    List<Constant> selectByExample(ConstantExample example);

    Constant selectByPrimaryKey(Integer authid);

    int updateByExampleSelective(@Param("record") Constant record, @Param("example") ConstantExample example);

    int updateByExample(@Param("record") Constant record, @Param("example") ConstantExample example);

    int updateByPrimaryKeySelective(Constant record);

    int updateByPrimaryKey(Constant record);
}