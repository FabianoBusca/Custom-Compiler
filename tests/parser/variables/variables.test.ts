import {createToken} from "../../../src/data";
import {parserTestt} from "../../utils";
import {ASTFactory} from "../../../src/utils/ASTFactory";

describe("Variables declarations and assignment", () => {
  test("Variable declaration - 1", () => {
    const source = "num x";
    
    const tokens = [
      createToken(31, "num", {line: 1, column: 1}, {line: 1, column: 4}),
      createToken(34, "x", {line: 1, column: 5}, {line: 1, column: 6}),
      createToken(0, "", {line: 1, column: 6}, {line: 1, column: 6}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "num",
                0,
                {line: 1, column: 1},
                {line: 1, column: 4},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "x",
                start: {line: 1, column: 5},
                end: {line: 1, column: 6},
              }),
            ),
          ],
          null,
          [],
          {line: 1, column: 1},
          {line: 1, column: 6},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 6},
    );
    
    parserTestt(source, tokens, expected);
  });
  
  test("Variable declaration - 2", () => {
    const source = "num x, str y, bool z";
    
    const tokens = [
      createToken(31, "num", {line: 1, column: 1}, {line: 1, column: 4}),
      createToken(34, "x", {line: 1, column: 5}, {line: 1, column: 6}),
      createToken(28, ",", {line: 1, column: 6}, {line: 1, column: 7}),
      createToken(32, "str", {line: 1, column: 8}, {line: 1, column: 11}),
      createToken(34, "y", {line: 1, column: 12}, {line: 1, column: 13}),
      createToken(28, ",", {line: 1, column: 13}, {line: 1, column: 14}),
      createToken(33, "bool", {line: 1, column: 15}, {line: 1, column: 19}),
      createToken(34, "z", {line: 1, column: 20}, {line: 1, column: 21}),
      createToken(0, "", {line: 1, column: 21}, {line: 1, column: 21}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "num",
                0,
                {line: 1, column: 1},
                {line: 1, column: 4},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "x",
                start: {line: 1, column: 5},
                end: {line: 1, column: 6},
              }),
            ),
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "str",
                0,
                {line: 1, column: 8},
                {line: 1, column: 11},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "y",
                start: {line: 1, column: 12},
                end: {line: 1, column: 13},
              }),
            ),
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "bool",
                0,
                {line: 1, column: 15},
                {line: 1, column: 19},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "z",
                start: {line: 1, column: 20},
                end: {line: 1, column: 21},
              }),
            ),
          ],
          null,
          [],
          {line: 1, column: 1},
          {line: 1, column: 21},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 21},
    );
    
    parserTestt(source, tokens, expected);
  });
  
  test("Variable declaration - 3", () => {
    const source = "dog d = _('Buddy', 5)";
    
    const tokens = [
      createToken(34, "dog", {line: 1, column: 1}, {line: 1, column: 4}),
      createToken(34, "d", {line: 1, column: 5}, {line: 1, column: 6}),
      createToken(21, "=", {line: 1, column: 7}, {line: 1, column: 8}),
      createToken(53, "_", {line: 1, column: 9}, {line: 1, column: 10}),
      createToken(22, "(", {line: 1, column: 10}, {line: 1, column: 11}),
      createToken(30, "'", {line: 1, column: 11}, {line: 1, column: 12}),
      createToken(
        36,
        "Buddy",
        {line: 1, column: 12},
        {line: 1, column: 17},
      ),
      createToken(30, "'", {line: 1, column: 17}, {line: 1, column: 18}),
      createToken(28, ",", {line: 1, column: 18}, {line: 1, column: 19}),
      createToken(35, "5", {line: 1, column: 20}, {line: 1, column: 21}),
      createToken(23, ")", {line: 1, column: 21}, {line: 1, column: 22}),
      createToken(0, "", {line: 1, column: 22}, {line: 1, column: 22}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "dog",
                0,
                {line: 1, column: 1},
                {line: 1, column: 4},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "d",
                start: {line: 1, column: 5},
                end: {line: 1, column: 6},
              }),
            ),
          ],
          21,
          [
            ASTFactory.createFunctionCall(
              ASTFactory.createIdentifier({
                tag: 53,
                value: "_",
                start: {line: 1, column: 9},
                end: {line: 1, column: 10},
              }),
              [
                ASTFactory.createFString(
                  [
                    ASTFactory.createStringNode({
                      tag: 30,
                      value: "Buddy",
                      start: {line: 1, column: 12},
                      end: {line: 1, column: 17},
                    }),
                  ],
                  {line: 1, column: 11},
                  {line: 1, column: 18},
                ),
                ASTFactory.createNumberNode({
                  tag: 35,
                  value: "5",
                  start: {line: 1, column: 20},
                  end: {line: 1, column: 21},
                }),
              ],
              {line: 1, column: 9},
              {line: 1, column: 22},
            ),
          ],
          {line: 1, column: 1},
          {line: 1, column: 22},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 22},
    );
    
    parserTestt(source, tokens, expected);
  });
  
  test("Variable declaration - 4", () => {
    const source = "dog d, x, _, bool b = 0";
    
    const tokens = [
      createToken(34, "dog", {line: 1, column: 1}, {line: 1, column: 4}),
      createToken(34, "d", {line: 1, column: 5}, {line: 1, column: 6}),
      createToken(28, ",", {line: 1, column: 6}, {line: 1, column: 7}),
      createToken(34, "x", {line: 1, column: 8}, {line: 1, column: 9}),
      createToken(28, ",", {line: 1, column: 9}, {line: 1, column: 10}),
      createToken(53, "_", {line: 1, column: 11}, {line: 1, column: 12}),
      createToken(28, ",", {line: 1, column: 12}, {line: 1, column: 13}),
      createToken(33, "bool", {line: 1, column: 14}, {line: 1, column: 18}),
      createToken(34, "b", {line: 1, column: 19}, {line: 1, column: 20}),
      createToken(21, "=", {line: 1, column: 21}, {line: 1, column: 22}),
      createToken(35, "0", {line: 1, column: 23}, {line: 1, column: 24}),
      createToken(0, "", {line: 1, column: 24}, {line: 1, column: 24}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "dog",
                0,
                {line: 1, column: 1},
                {line: 1, column: 4},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "d",
                start: {line: 1, column: 5},
                end: {line: 1, column: 6},
              }),
            ),
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "x",
                start: {line: 1, column: 8},
                end: {line: 1, column: 9},
              }),
            ),
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 53,
                value: "_",
                start: {line: 1, column: 11},
                end: {line: 1, column: 12},
              }),
            ),
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "bool",
                0,
                {line: 1, column: 14},
                {line: 1, column: 18},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "b",
                start: {line: 1, column: 19},
                end: {line: 1, column: 20},
              }),
            ),
          ],
          21,
          [
            ASTFactory.createNumberNode({
              tag: 35,
              value: "0",
              start: {line: 1, column: 23},
              end: {line: 1, column: 24},
            }),
          ],
          {line: 1, column: 1},
          {line: 1, column: 24},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 24},
    );
    
    parserTestt(source, tokens, expected);
  });
  
  test("Variable assignment - 1", () => {
    const source = "a = foo()[0]";
    
    const tokens = [
      createToken(34, "a", {line: 1, column: 1}, {line: 1, column: 2}),
      createToken(21, "=", {line: 1, column: 3}, {line: 1, column: 4}),
      createToken(34, "foo", {line: 1, column: 5}, {line: 1, column: 8}),
      createToken(22, "(", {line: 1, column: 8}, {line: 1, column: 9}),
      createToken(23, ")", {line: 1, column: 9}, {line: 1, column: 10}),
      createToken(24, "[", {line: 1, column: 10}, {line: 1, column: 11}),
      createToken(35, "0", {line: 1, column: 11}, {line: 1, column: 12}),
      createToken(25, "]", {line: 1, column: 12}, {line: 1, column: 13}),
      createToken(0, "", {line: 1, column: 13}, {line: 1, column: 13}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "a",
                start: {line: 1, column: 1},
                end: {line: 1, column: 2},
              }),
            ),
          ],
          21,
          [
            ASTFactory.createArrayElement(
              ASTFactory.createFunctionCall(
                ASTFactory.createIdentifier({
                  tag: 34,
                  value: "foo",
                  start: {line: 1, column: 5},
                  end: {line: 1, column: 8},
                }),
                [],
                {line: 1, column: 5},
                {line: 1, column: 10},
              ),
              [
                ASTFactory.createNumberNode({
                  tag: 35,
                  value: "0",
                  start: {line: 1, column: 11},
                  end: {line: 1, column: 12},
                }),
              ],
              {line: 1, column: 5},
              {line: 1, column: 13},
            ),
          ],
          {line: 1, column: 1},
          {line: 1, column: 13},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 13},
    );
    
    parserTestt(source, tokens, expected);
  });
  
  test("Variable assignment - 2", () => {
    const source = "x = \"a\" + 'f {x.y}'";
    
    const tokens = [
      createToken(34, "x", {line: 1, column: 1}, {line: 1, column: 2}),
      createToken(21, "=", {line: 1, column: 3}, {line: 1, column: 4}),
      createToken(36, "a", {line: 1, column: 5}, {line: 1, column: 8}),
      createToken(1, "+", {line: 1, column: 9}, {line: 1, column: 10}),
      createToken(30, '"', {line: 1, column: 11}, {line: 1, column: 12}),
      createToken(36, "f ", {line: 1, column: 12}, {line: 1, column: 14}),
      createToken(26, "{", {line: 1, column: 14}, {line: 1, column: 15}),
      createToken(34, "x", {line: 1, column: 15}, {line: 1, column: 16}),
      createToken(29, ".", {line: 1, column: 16}, {line: 1, column: 17}),
      createToken(34, "y", {line: 1, column: 17}, {line: 1, column: 18}),
      createToken(27, "}", {line: 1, column: 18}, {line: 1, column: 19}),
      createToken(30, '"', {line: 1, column: 19}, {line: 1, column: 20}),
      createToken(0, "", {line: 1, column: 20}, {line: 1, column: 20}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "x",
                start: {line: 1, column: 1},
                end: {line: 1, column: 2},
              }),
            ),
          ],
          21,
          [
            ASTFactory.createBinaryExpression(
              ASTFactory.createStringNode({
                tag: 36,
                value: "a",
                start: {line: 1, column: 5},
                end: {line: 1, column: 8},
              }),
              1,
              ASTFactory.createFString(
                [
                  ASTFactory.createStringNode({
                    tag: 36,
                    value: "f ",
                    start: {line: 1, column: 12},
                    end: {line: 1, column: 14},
                  }),
                  ASTFactory.createMemberAttribute(
                    ASTFactory.createIdentifier({
                      tag: 34,
                      value: "x",
                      start: {line: 1, column: 15},
                      end: {line: 1, column: 16},
                    }),
                    ASTFactory.createIdentifier({
                      tag: 34,
                      value: "y",
                      start: {line: 1, column: 17},
                      end: {line: 1, column: 18},
                    }),
                  ),
                ],
                {line: 1, column: 11},
                {line: 1, column: 20},
              ),
            ),
          ],
          {line: 1, column: 1},
          {line: 1, column: 20},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 20},
    );
    
    parserTestt(source, tokens, expected);
  });
  
  test("Variable assignment - 3", () => {
    const source = "x, y, z = 5.23, 'Hello {x}', \"World\"";
    
    const tokens = [
      createToken(34, "x", {line: 1, column: 1}, {line: 1, column: 2}),
      createToken(28, ",", {line: 1, column: 2}, {line: 1, column: 3}),
      createToken(34, "y", {line: 1, column: 4}, {line: 1, column: 5}),
      createToken(28, ",", {line: 1, column: 5}, {line: 1, column: 6}),
      createToken(34, "z", {line: 1, column: 7}, {line: 1, column: 8}),
      createToken(21, "=", {line: 1, column: 9}, {line: 1, column: 10}),
      createToken(35, "5.23", {line: 1, column: 11}, {line: 1, column: 15}),
      createToken(28, ",", {line: 1, column: 15}, {line: 1, column: 16}),
      createToken(30, "'", {line: 1, column: 17}, {line: 1, column: 18}),
      createToken(
        36,
        "Hello ",
        {line: 1, column: 18},
        {line: 1, column: 24},
      ),
      createToken(26, "{", {line: 1, column: 24}, {line: 1, column: 25}),
      createToken(34, "x", {line: 1, column: 25}, {line: 1, column: 26}),
      createToken(27, "}", {line: 1, column: 26}, {line: 1, column: 27}),
      createToken(30, "'", {line: 1, column: 27}, {line: 1, column: 28}),
      createToken(28, ",", {line: 1, column: 28}, {line: 1, column: 29}),
      createToken(
        36,
        "World",
        {line: 1, column: 30},
        {line: 1, column: 37},
      ),
      createToken(0, "", {line: 1, column: 37}, {line: 1, column: 37}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "x",
                start: {line: 1, column: 1},
                end: {line: 1, column: 2},
              }),
            ),
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "y",
                start: {line: 1, column: 4},
                end: {line: 1, column: 5},
              }),
            ),
            ASTFactory.createVariableAssignment(
              ASTFactory.createIdentifier({
                tag: 34,
                value: "z",
                start: {line: 1, column: 7},
                end: {line: 1, column: 8},
              }),
            ),
          ],
          21,
          [
            ASTFactory.createNumberNode({
              tag: 35,
              value: "5.23",
              start: {line: 1, column: 11},
              end: {line: 1, column: 15},
            }),
            ASTFactory.createFString(
              [
                ASTFactory.createStringNode({
                  tag: 30,
                  value: "Hello ",
                  start: {line: 1, column: 18},
                  end: {line: 1, column: 24},
                }),
                ASTFactory.createIdentifier({
                  tag: 34,
                  value: "x",
                  start: {line: 1, column: 25},
                  end: {line: 1, column: 26},
                }),
              ],
              {line: 1, column: 17},
              {line: 1, column: 28},
            ),
            ASTFactory.createStringNode({
              tag: 36,
              value: "World",
              start: {line: 1, column: 30},
              end: {line: 1, column: 37},
            }),
          ],
          {line: 1, column: 1},
          {line: 1, column: 37},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 37},
    );
    
    parserTestt(source, tokens, expected);
  });
  
  test("Variable assignment - 4", () => {
    const source = "num[][] a = [[], [1, 2, 3, 4, 5], [1, 3], []]";
    
    const tokens = [
      createToken(31, "num", {line: 1, column: 1}, {line: 1, column: 4}),
      createToken(24, "[", {line: 1, column: 4}, {line: 1, column: 5}),
      createToken(25, "]", {line: 1, column: 5}, {line: 1, column: 6}),
      createToken(24, "[", {line: 1, column: 6}, {line: 1, column: 7}),
      createToken(25, "]", {line: 1, column: 7}, {line: 1, column: 8}),
      createToken(34, "a", {line: 1, column: 9}, {line: 1, column: 10}),
      createToken(21, "=", {line: 1, column: 11}, {line: 1, column: 12}),
      createToken(24, "[", {line: 1, column: 13}, {line: 1, column: 14}),
      createToken(24, "[", {line: 1, column: 14}, {line: 1, column: 15}),
      createToken(25, "]", {line: 1, column: 15}, {line: 1, column: 16}),
      createToken(28, ",", {line: 1, column: 16}, {line: 1, column: 17}),
      createToken(24, "[", {line: 1, column: 18}, {line: 1, column: 19}),
      createToken(35, "1", {line: 1, column: 19}, {line: 1, column: 20}),
      createToken(28, ",", {line: 1, column: 20}, {line: 1, column: 21}),
      createToken(35, "2", {line: 1, column: 22}, {line: 1, column: 23}),
      createToken(28, ",", {line: 1, column: 23}, {line: 1, column: 24}),
      createToken(35, "3", {line: 1, column: 25}, {line: 1, column: 26}),
      createToken(28, ",", {line: 1, column: 26}, {line: 1, column: 27}),
      createToken(35, "4", {line: 1, column: 28}, {line: 1, column: 29}),
      createToken(28, ",", {line: 1, column: 29}, {line: 1, column: 30}),
      createToken(35, "5", {line: 1, column: 31}, {line: 1, column: 32}),
      createToken(25, "]", {line: 1, column: 32}, {line: 1, column: 33}),
      createToken(28, ",", {line: 1, column: 33}, {line: 1, column: 34}),
      createToken(24, "[", {line: 1, column: 35}, {line: 1, column: 36}),
      createToken(35, "1", {line: 1, column: 36}, {line: 1, column: 37}),
      createToken(28, ",", {line: 1, column: 37}, {line: 1, column: 38}),
      createToken(35, "3", {line: 1, column: 39}, {line: 1, column: 40}),
      createToken(25, "]", {line: 1, column: 40}, {line: 1, column: 41}),
      createToken(28, ",", {line: 1, column: 41}, {line: 1, column: 42}),
      createToken(24, "[", {line: 1, column: 43}, {line: 1, column: 44}),
      createToken(25, "]", {line: 1, column: 44}, {line: 1, column: 45}),
      createToken(25, "]", {line: 1, column: 45}, {line: 1, column: 46}),
      createToken(0, "", {line: 1, column: 46}, {line: 1, column: 46}),
    ];
    
    const expected = ASTFactory.createProgram(
      [
        ASTFactory.createVariableOperations(
          [
            ASTFactory.createVariableDeclaration(
              ASTFactory.createType(
                "num",
                2,
                {line: 1, column: 1},
                {line: 1, column: 8},
              ),
              ASTFactory.createIdentifier({
                tag: 34,
                value: "a",
                start: {line: 1, column: 9},
                end: {line: 1, column: 10},
              }),
            ),
          ],
          21,
          [
            ASTFactory.createArrayNode(
              [
                ASTFactory.createArrayNode(
                  [],
                  {line: 1, column: 14},
                  {line: 1, column: 16},
                ),
                ASTFactory.createArrayNode(
                  [
                    ASTFactory.createNumberNode({
                      tag: 35,
                      value: "1",
                      start: {line: 1, column: 19},
                      end: {line: 1, column: 20},
                    }),
                    ASTFactory.createNumberNode({
                      tag: 35,
                      value: "2",
                      start: {line: 1, column: 22},
                      end: {line: 1, column: 23},
                    }),
                    ASTFactory.createNumberNode({
                      tag: 35,
                      value: "3",
                      start: {line: 1, column: 25},
                      end: {line: 1, column: 26},
                    }),
                    ASTFactory.createNumberNode({
                      tag: 35,
                      value: "4",
                      start: {line: 1, column: 28},
                      end: {line: 1, column: 29},
                    }),
                    ASTFactory.createNumberNode({
                      tag: 35,
                      value: "5",
                      start: {line: 1, column: 31},
                      end: {line: 1, column: 32},
                    }),
                  ],
                  {line: 1, column: 18},
                  {line: 1, column: 33},
                ),
                ASTFactory.createArrayNode(
                  [
                    ASTFactory.createNumberNode({
                      tag: 35,
                      value: "1",
                      start: {line: 1, column: 36},
                      end: {line: 1, column: 37},
                    }),
                    ASTFactory.createNumberNode({
                      tag: 35,
                      value: "3",
                      start: {line: 1, column: 39},
                      end: {line: 1, column: 40},
                    }),
                  ],
                  {line: 1, column: 35},
                  {line: 1, column: 41},
                ),
                ASTFactory.createArrayNode(
                  [],
                  {line: 1, column: 43},
                  {line: 1, column: 45},
                ),
              ],
              {line: 1, column: 13},
              {line: 1, column: 46},
            ),
          ],
          {line: 1, column: 1},
          {line: 1, column: 46},
        ),
      ],
      {line: 1, column: 1},
      {line: 1, column: 46},
    );
    
    parserTestt(source, tokens, expected);
  });
});
