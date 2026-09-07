# Cold Hawaii Big Air 2026 - Men's division - full heat data from heatscoring.com
# Fields per row: round, heat_no, athlete, moves(list, 0=crash), result, auto_imp, impression, total
# auto_imp: 0-7, +1 per unique trick landed above 5.5 (trick variety bonus)
# impression: 0-3, judges' subjective bonus
# result: sum of the athlete's 3 best (non-crash) move scores in that heat
# total = result + auto_imp + impression

HEATS = [
    ("Round 1", 1, "Maxwell Dahl",       [6.4,6.03,6.9,6,6.57,6.27], 19.87, 4, 2.77, 26.64),
    ("Round 1", 1, "Cohan van Dijk",     [6.07,6.2,0,0,6.57,5.67,6.9,5.43], 19.67, 3, 1.47, 24.14),
    ("Round 1", 1, "Zac Adams",          [6.8,5.43,7.03,3.63,0], 19.26, 2, 1.97, 23.23),

    ("Round 1", 2, "Shahar Tsabary",     [7.13,7.23,5.5,5.9,0,6.5,7.07,0,0], 21.43, 5, 2.73, 29.16),
    ("Round 1", 2, "Stijn Mul",          [6.67,4.17,6.6,2,5.83,5.67,6.1,6.73,6.33,5.43], 20.0, 6, 2.1, 28.1),
    ("Round 1", 2, "Parker Sage",        [6.03,0,6.3,0,5.93,5.73,0,0], 18.26, 3, 1.1, 22.36),

    ("Round 1", 3, "Lorenzo Casati",     [7.67,7.57,0,6.47,6.43,7.27,0,7.93,4.13,5.1,5.1,6.67], 23.17, 4, 2.73, 29.9),
    ("Round 1", 3, "Leonardo Casati",    [7.6,0,0,6.9,6.57,0,0,5.27], 21.07, 3, 2.0, 26.07),
    ("Round 1", 3, "Charles Brodel",     [0,0,6.83,0,7.07,7.27,0,5.65], 21.17, 3, 0.8, 24.97),

    ("Round 1", 4, "Giel Vlugt",         [4.9,5.33,6.8,6.05,5.15,6.27,3.87,0,5.77], 19.12, 3, 2.4, 24.52),
    ("Round 1", 4, "Martin Rahnel",      [0,0,6.4,6.63,3.27,3.6,5.2,0,4.5], 18.23, 2, 1.97, 22.2),
    ("Round 1", 4, "Clement Huot",       [0,5.3,0,4.97,0,3.1], 13.37, 0, 0.93, 14.3),

    ("Round 1", 5, "Hugo Wigglesworth",  [5.97,0,6.45,6.8,0,6.97,6.1,6.93,6.77,0,6.6], 20.7, 7, 2.4, 30.1),
    ("Round 1", 5, "Jamie Overbeek",     [6.87,7.13,5.5,7,4.47,6.37,7.13,7.1], 21.36, 4, 2.7, 28.06),
    ("Round 1", 5, "Timo Boersema",      [6.43,6.8,0,0,0,0,6.6,7.23], 20.63, 3, 1.4, 25.03),

    ("Round 1", 6, "Jeremy Burlando",    [6.77,6.87,7.17,6.5,6.73,6.23,0,3.8,6.23,7,5.93,6.97], 21.14, 7, 2.77, 30.91),
    ("Round 1", 6, "Jason van der Spuy", [6.53,6.33,6.9,6.6,6.63,5.07,6.2,1.17], 20.13, 4, 1.93, 26.06),
    ("Round 1", 6, "Yucel Paralik",      [7.17,7.3,6.1,0,6.1,0,0,3.97], 20.57, 3, 1.83, 25.4),

    ("Round 2", 7, "Martin Rahnel",      [6.5,6.57,6.5,6.97,0,7.2,0], 20.74, 4, 1.23, 25.97),
    ("Round 2", 7, "Timo Boersema",      [7,6.6,6.77,6.57,6.53,4.5], 20.37, 3, 2.17, 25.54),

    ("Round 2", 8, "Stijn Mul",          [3.47,4.93,4.5,6.47,6.9,6.07,4.97,5.97,6.63,4.13,0], 20.0, 4, 2.0, 26.0),
    ("Round 2", 8, "Zac Adams",          [0,0,6.73,6.7,6.67,6.53,0], 20.1, 4, 1.47, 25.57),

    ("Round 2", 9, "Jamie Overbeek",     [6.37,6.87,6.8,7.07,7.17,3.17,6.73], 21.11, 4, 2.4, 27.51),
    ("Round 2", 9, "Yucel Paralik",      [0,6.5,0,6.93,6,5.97,0], 19.43, 3, 0.9, 23.33),

    ("Round 2", 10, "Jason van der Spuy",[6.7,5.1,6.53,0,6.23,6.3,0,6.73], 19.96, 4, 2.2, 26.16),
    ("Round 2", 10, "Parker Sage",       [0,5.1,0,6.37,0,6.6], 18.07, 2, 1.03, 21.1),

    ("Round 2", 11, "Cohan van Dijk",    [3.97,0,7.33,7,7.2,6.83,6.3,7.1], 21.63, 5, 1.67, 28.3),
    ("Round 2", 11, "Charles Brodel",    [0,0,6.37,7.07,7.07,7.07,6.6,0,7.47], 21.61, 4, 1.87, 27.48),

    ("Round 2", 12, "Leonardo Casati",   [7.03,7.3,7.2,0,7.3,0,6.77,6.5,5.57], 21.8, 7, 2.73, 31.53),
    ("Round 2", 12, "Clement Huot",      [5.93,5.53,6.63,0,6.47,0,0,2.9], 19.03, 3, 0.9, 22.93),

    ("Round 3", 13, "Jamie Overbeek",    [7.1,6.9,6.8,7.4,6.83,6.63,7.47,6.97], 21.97, 7, 2.6, 31.57),
    ("Round 3", 13, "Maxwell Dahl",      [6.57,6.83,6.77,0,6.83,6.93,6.07,6.2], 20.59, 5, 1.87, 27.46),

    ("Round 3", 14, "Shahar Tsabary",    [7.23,7.93,6.6,6.55,0,0,7.17,6.67], 22.33, 6, 2.27, 30.6),
    ("Round 3", 14, "Jason van der Spuy",[7.07,7.55,6.87,6.83,7.6,0], 22.22, 4, 2.13, 28.35),

    ("Round 3", 15, "Lorenzo Casati",    [7.2,6.5,6.43,8.4,0,7.13,6.97,6.8,7.27], 22.87, 7, 2.67, 32.54),
    ("Round 3", 15, "Martin Rahnel",     [6.8,6.5,0,6.57], 19.87, 3, 1.23, 24.1),

    ("Round 3", 16, "Leonardo Casati",   [7.07,7.07,7.43,7.5,6.97,6.9,6.5,9.23], 24.16, 7, 2.9, 34.06),
    ("Round 3", 16, "Giel Vlugt",        [7,6.83,6.47,6.7,7.07,7.87], 21.94, 4, 1.83, 27.77),

    ("Round 3", 17, "Stijn Mul",         [3.9,5.67,6.7,7.13,7.43,6.53,7.03,6.53], 21.59, 6, 2.33, 29.92),
    ("Round 3", 17, "Hugo Wigglesworth", [0,7.1,6.8,7.17,0,7.17,0,0,4.35], 21.44, 4, 1.77, 27.21),

    ("Round 3", 18, "Jeremy Burlando",   [0,6.87,6.67,0,7.2,7.53,7.17], 21.9, 4, 2.33, 28.23),
    ("Round 3", 18, "Cohan van Dijk",    [6.8,0,7.03,6.7,5.3,6.6], 20.53, 4, 1.77, 26.3),

    ("Semi Finals", 19, "Lorenzo Casati", [0,8.23,8.27,8.27,7.47,7.1,7.27,6.73,7.33], 24.77, 7, 2.87, 34.64),
    ("Semi Finals", 19, "Jamie Overbeek", [7.83,7.63,8.33,0,7.6], 23.79, 4, 2.07, 29.86),

    ("Semi Finals", 20, "Stijn Mul",      [6.93,7.1,3.67,6.63,7.2,7.2,6.5,6.8], 21.5, 6, 2.37, 29.87),
    ("Semi Finals", 20, "Shahar Tsabary", [0,6.83,7.1,7.73,6.83,6.7,0,7.03], 21.86, 6, 2.0, 29.86),

    ("Semi Finals", 21, "Leonardo Casati", [7.7,7.17,6.73,7,7.03,5.33,6.97,7.57,7.1,7.27], 22.54, 7, 2.23, 31.77),
    ("Semi Finals", 21, "Jeremy Burlando", [6.93,7.27,0,0,7.37,7.57,8.4,7.73], 23.7, 4, 2.17, 29.87),

    ("Final", 22, "Leonardo Casati", [7.6,7.43,7.47,7.2,7.05,6.87,7.23,7.6,8.2,8.47], 24.27, 7, 2.33, 33.6),
    ("Final", 22, "Lorenzo Casati",  [6.9,7.5,7.3,7,7.47,5.8,6.97,7.03,8.13,7.77,0,0,0], 23.4, 7, 2.6, 33.0),
    ("Final", 22, "Stijn Mul",       [7.25,7,6.77,0,7,7.1,7.1,7.27,6.87,7.2,0,0], 21.72, 7, 1.53, 30.25),
]

RESULT_ORDER = {
    1: ["Maxwell Dahl","Cohan van Dijk","Zac Adams"],
    2: ["Shahar Tsabary","Stijn Mul","Parker Sage"],
    3: ["Lorenzo Casati","Leonardo Casati","Charles Brodel"],
    4: ["Giel Vlugt","Martin Rahnel","Clement Huot"],
    5: ["Hugo Wigglesworth","Jamie Overbeek","Timo Boersema"],
    6: ["Jeremy Burlando","Jason van der Spuy","Yucel Paralik"],
    7: ["Martin Rahnel","Timo Boersema"],
    8: ["Stijn Mul","Zac Adams"],
    9: ["Jamie Overbeek","Yucel Paralik"],
    10: ["Jason van der Spuy","Parker Sage"],
    11: ["Cohan van Dijk","Charles Brodel"],
    12: ["Leonardo Casati","Clement Huot"],
    13: ["Jamie Overbeek","Maxwell Dahl"],
    14: ["Shahar Tsabary","Jason van der Spuy"],
    15: ["Lorenzo Casati","Martin Rahnel"],
    16: ["Leonardo Casati","Giel Vlugt"],
    17: ["Stijn Mul","Hugo Wigglesworth"],
    18: ["Jeremy Burlando","Cohan van Dijk"],
    19: ["Lorenzo Casati","Jamie Overbeek"],
    20: ["Stijn Mul","Shahar Tsabary"],
    21: ["Leonardo Casati","Jeremy Burlando"],
    22: ["Leonardo Casati","Lorenzo Casati","Stijn Mul"],
}

NATIONALITY = {
    "Charles Brodel":"FR","Clement Huot":"FR","Cohan van Dijk":"NL","Giel Vlugt":"NL",
    "Hugo Wigglesworth":"NZ","Jamie Overbeek":"NL","Jason van der Spuy":"ZA","Jeremy Burlando":"IT",
    "Leonardo Casati":"IT","Lorenzo Casati":"ES","Martin Rahnel":"EE","Maxwell Dahl":"DK",
    "Parker Sage":"US","Shahar Tsabary":"IL","Stijn Mul":"NL","Timo Boersema":"NL",
    "Yucel Paralik":"CY","Zac Adams":"US",
}
