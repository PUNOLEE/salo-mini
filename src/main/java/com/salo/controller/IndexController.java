package com.salo.controller;

import com.salo.model.Bo.RestResponseBo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class IndexController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);


    @GetMapping(value = "/")
    @ResponseBody
    public RestResponseBo index() {
        return RestResponseBo.ok();
    }




}
