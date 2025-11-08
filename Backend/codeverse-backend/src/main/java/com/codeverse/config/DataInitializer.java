package com.codeverse.config;

import com.codeverse.entity.Difficulty;
import com.codeverse.entity.Problem;
import com.codeverse.entity.TestCase;
import com.codeverse.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    @Autowired
    public DataInitializer(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (problemRepository.count() == 0) {
            createTwoSumProblem();
        }
    }

    private void createTwoSumProblem() {
        Problem twoSum = new Problem();
        twoSum.setTitle("Two Sum");
        twoSum.setDescription("Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.");
        twoSum.setDifficulty(Difficulty.EASY);

        List<TestCase> testCases = new ArrayList<>();

        TestCase tc1 = new TestCase();
        tc1.setInput("{\"nums\": [2, 7, 11, 15], \"target\": 9}");
        tc1.setExpectedOutput("[0, 1]");
        tc1.setProblem(twoSum);
        testCases.add(tc1);

        twoSum.setTestCases(testCases);

        problemRepository.save(twoSum);
    }
}