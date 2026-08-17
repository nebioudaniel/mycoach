-- +goose Up

-- ─── Learning Path ────────────────────────────────────────────────────────
INSERT INTO learning_paths (id, slug, title, description, position) VALUES
('a1000000-0000-0000-0000-000000000001', 'dsa-fundamentals', 'Data Structures & Algorithms', 'Master the building blocks of computer science. Learn core data structures, algorithmic thinking, and problem-solving patterns used in every technical interview.', 1);

-- ─── Topics ───────────────────────────────────────────────────────────────

INSERT INTO topics (id, path_id, slug, title, difficulty, content, position) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'arrays', 'Arrays & Strings', 'beginner',
'{"what":"An array is a contiguous block of memory storing elements of the same type, accessible by index in O(1) time. Strings are sequences of characters, often implemented as arrays under the hood.","why":"Arrays are the most fundamental data structure. Nearly every other structure builds on array concepts. Understanding them deeply unlocks efficient memory access patterns.","mentalModel":"Think of a row of mailboxes, each numbered sequentially. You can instantly grab mail from any mailbox by its number — that is array indexing. The trade-off: inserting or deleting in the middle requires shifting everything after it.","visual":"Index:   [0]  [1]  [2]  [3]  [4]\nValues:   10   20   30   40   50\nMemory:   |10| |20| |30| |40| |50|  (contiguous)","examples":["Accessing arr[2] returns 30 in O(1).","Inserting at index 2 shifts elements 2..4 right: O(n).","Slicing arr[1:3] creates a new array [20, 30]."],"complexity":{"access":"O(1)","search":"O(n)","insert_end":"O(1) amortized","insert_middle":"O(n)","delete_middle":"O(n)"},"tryIt":["Create an array of the first 10 even numbers.","Write a function that reverses an array in-place.","Find the second largest element in a single pass."],"checkUnderstanding":["Why is array access O(1) but insertion in the middle O(n)?","What happens when you append to a dynamic array beyond its capacity?","How would you remove duplicates from a sorted array in-place?"],"resources":["https://en.wikipedia.org/wiki/Array_data_structure","https://visualgo.net/en/array"]}', 1),

('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'hash-maps', 'Hash Maps', 'beginner',
'{"what":"A hash map (hash table, dictionary) stores key-value pairs. A hash function maps keys to array indices, giving average O(1) lookup, insert, and delete.","why":"Hash maps are the go-to for fast lookups. When you need to count frequencies, group items, or check membership, hash maps beat every other structure.","mentalModel":"Imagine a wall of numbered pigeonholes. To store something, you run the key through a machine (hash function) that tells you which hole to use. If two keys map to the same hole (collision), you chain them in a list inside that hole.","visual":"Key: \"apple\" → hash(\"apple\") = 3 → bucket[3]\nKey: \"banana\" → hash(\"banana\") = 7 → bucket[7]\nCollision: hash(\"cat\") = 3 → bucket[3] → chain: [(cat,3), (hat,5)]","examples":["word_count: iterate text, increment map[word] — O(n)","Two Sum: for each num, check if (target-num) exists in map — O(n)","Group anagrams: map sorted-string → list of words — O(n·k log k)"],"complexity":{"lookup":"O(1) average, O(n) worst","insert":"O(1) average","delete":"O(1) average","space":"O(n)"},"tryIt":["Implement a simple word frequency counter.","Use a hash map to find the first duplicate in an array.","Solve Two Sum using a hash map for O(n) time."],"checkUnderstanding":["What causes worst-case O(n) in a hash map?","How do you handle hash collisions?","When would you use a hash map vs a sorted array?"],"resources":["https://en.wikipedia.org/wiki/Hash_table","https://visualgo.net/en/hashtable"]}', 2),

('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'linked-lists', 'Linked Lists', 'beginner',
'{"what":"A linked list is a chain of nodes where each node holds a value and a pointer to the next node. Unlike arrays, nodes can be scattered in memory.","why":"Linked lists teach pointer manipulation and are the foundation for stacks, queues, and graph adjacency lists. Many interview problems test your ability to traverse and rewire pointers.","mentalModel":"Think of a treasure hunt: each clue (node) tells you where to find the next one. You can only move forward by following pointers. To insert a new clue, you just redirect one pointer — no shifting needed.","visual":"[1|→] → [2|→] → [3|→] → null\nInsert 2.5: [1|→] → [2|→] → [2.5|→] → [3|→] → null","examples":["Reversing a list: track prev, curr, next — O(n) time, O(1) space","Detecting a cycle: Floyd''s tortoise and hare — O(n)","Merging two sorted lists: compare heads, attach smaller — O(n+m)"],"complexity":{"access":"O(n)","search":"O(n)","insert_begin":"O(1)","insert_end":"O(1) with tail pointer","delete_begin":"O(1)","space":"O(n)"},"tryIt":["Reverse a singly linked list in-place.","Find the middle element with two pointers.","Detect if a linked list has a cycle."],"checkUnderstanding":["Why use linked lists over arrays when insert at head is common?","How would you find the kth element from the end in one pass?","What is the difference between singly and doubly linked lists?"],"resources":["https://visualgo.net/en/list","https://en.wikipedia.org/wiki/Linked_list"]}', 3),

('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'stacks-queues', 'Stacks & Queues', 'beginner',
'{"what":"A stack is LIFO (last-in, first-out): you push and pop from the same end. A queue is FIFO (first-in, first-out): you enqueue at the back and dequeue from the front.","why":"Stacks and queues appear everywhere: function call stacks, undo/redo, BFS (queue), DFS (stack), sliding window problems, and expression evaluation.","mentalModel":"Stack = a stack of plates: you add to the top and remove from the top. Queue = a line at a store: first person in line gets served first.","visual":"Stack (LIFO): push 1,2,3 → top is 3 → pop gives 3\nQueue (FIFO): enqueue 1,2,3 → front is 1 → dequeue gives 1\n\nStack:  [1]\n        [2]\n        [3] ← top\n\nQueue:  front → [1] [2] [3] ← back","examples":["Valid Parentheses: push opening brackets, pop on closing — O(n)","BFS traversal: enqueue root, process level by level — O(V+E)","Sliding window max: monotonic deque for O(n) solution"],"complexity":{"stack_push":"O(1)","stack_pop":"O(1)","queue_enqueue":"O(1)","queue_dequeue":"O(1)","space":"O(n)"},"tryIt":["Implement a stack using two queues.","Use a stack to evaluate a postfix expression.","Implement a circular buffer for a queue."],"checkUnderstanding":["When would you use a stack instead of recursion?","How do you implement a queue using two stacks?","What is a monotonic stack and when is it useful?"],"resources":["https://visualgo.net/en/stack","https://visualgo.net/en/queue"]}', 4),

('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'trees', 'Trees & Binary Search Trees', 'intermediate',
'{"what":"A tree is a hierarchical data structure of nodes connected by edges. A binary tree has at most 2 children per node. A BST maintains the invariant: left < root < right.","why":"Trees model hierarchical data (files, org charts) and enable O(log n) search when balanced. BSTs, heaps, and tries are all tree variants used constantly in real systems.","mentalModel":"A family tree turned upside down: root at top, branches going down. BST is like a binary search: go left if smaller, right if bigger, cut the search space in half each step.","visual":"BST:\n        8\n       / \\\n      3   10\n     / \\    \\\n    1   6    14\n       / \\   /\n      4   7 13","examples":["Inorder traversal of BST gives sorted order — O(n)","Lowest Common Ancestor: recurse left/right, first split point is LCA — O(h)","Validate BST: check min/max bounds at each node — O(n)"],"complexity":{"search":"O(log n) balanced, O(n) worst","insert":"O(log n) balanced","delete":"O(log n) balanced","traverse":"O(n)","space":"O(h) for recursion"},"tryIt":["Implement BST insert and search.","Find the height of a binary tree.","Check if a binary tree is balanced."],"checkUnderstanding":["When does a BST degrade to O(n)?","What is the difference between inorder, preorder, and postorder?","How do you serialize and deserialize a binary tree?"],"resources":["https://visualgo.net/en/bst","https://en.wikipedia.org/wiki/Binary_search_tree"]}', 5),

('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'graphs', 'Graphs', 'intermediate',
'{"what":"A graph is a collection of vertices (nodes) and edges (connections). Graphs can be directed/undirected, weighted/unweighted, and represented as adjacency lists or matrices.","why":"Graphs model networks: social connections, road maps, dependency chains, and web pages. Many real-world problems reduce to graph traversal or shortest path.","mentalModel":"Think of a city map: intersections are vertices, roads are edges. You can model one-way streets (directed), distances (weighted), and find the shortest route (Dijkstra).","visual":"Adjacency List:          Adjacency Matrix:\nA → [B, C]               A B C\nB → [A, D]             A 0 1 1\nC → [A, D]             B 1 0 1\nD → [B, C]             C 1 1 0\n                        D 0 1 1","examples":["BFS shortest path in unweighted graph — O(V+E)","DFS cycle detection — O(V+E)","Dijkstra shortest path in weighted graph — O((V+E) log V)"],"complexity":{"bfs":"O(V+E)","dfs":"O(V+E)","dijkstra":"O((V+E) log V)","space":"O(V+E) for adjacency list"},"tryIt":["Implement BFS and DFS from scratch.","Detect if a directed graph has a cycle.","Find all connected components in an undirected graph."],"checkUnderstanding":["When do you use BFS vs DFS?","How do you represent a weighted graph efficiently?","What is topological sorting and when is it useful?"],"resources":["https://visualgo.net/en/dfsbfs","https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)"]}', 6),

('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'sorting', 'Sorting Algorithms', 'intermediate',
'{"what":"Sorting arranges elements in a specific order. Key algorithms: bubble sort O(n²), merge sort O(n log n), quicksort O(n log n) average, heapsort O(n log n).","why":"Sorting is a building block: it enables binary search, simplifies many problems, and understanding trade-offs between algorithms teaches algorithmic thinking.","mentalModel":"Merge sort = divide the deck in half repeatedly, then merge sorted halves. Quicksort = pick a pivot, push smaller left and bigger right, recurse. Like organizing a bookshelf by repeatedly splitting piles.","visual":"Merge Sort:     [38,27,43,3,9,82,10]\n                /                  \\\n         [38,27,43,3]          [9,82,10]\n         /         \\           /       \\\n      [38,27]   [43,3]     [9,82]    [10]\n      /    \\    /   \\      /   \\\n   [38]  [27] [43] [3]  [9]  [82]   [10]\n      \\    /    \\   /      \\   /\n      [27,38]   [3,43]     [9,82]    [10]\n         \\         /           \\       /\n         [3,27,38,43]          [9,10,82]\n                \\                  /\n         [3, 9, 10, 27, 38, 43, 82]","examples":["Merge sort for linked lists — stable, O(n log n)","Quicksort for arrays — cache-friendly, O(n log n) avg","Counting sort for integers in known range — O(n+k)"],"complexity":{"bubble":"O(n²)","merge":"O(n log n)","quick_avg":"O(n log n)","quick_worst":"O(n²)","heap":"O(n log n)","space_merge":"O(n)","space_quick":"O(log n)"},"tryIt":["Implement merge sort from scratch.","Sort an array of 0s, 1s, and 2s in one pass (Dutch National Flag).","Find the kth largest element without fully sorting."],"checkUnderstanding":["Why is quicksort often faster than merge sort in practice despite same Big-O?","When would you choose merge sort over quicksort?","What makes a sorting algorithm stable?"],"resources":["https://visualgo.net/en/sorting","https://en.wikipedia.org/wiki/Sorting_algorithm"]}', 7),

('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000001', 'binary-search', 'Binary Search', 'intermediate',
'{"what":"Binary search finds a target in a sorted collection by repeatedly halving the search space. Check the middle, eliminate half, repeat.","why":"Binary search reduces O(n) linear scan to O(log n). It is one of the most important algorithmic techniques and appears in interviews constantly.","mentalModel":"Like guessing a number between 1-100: ask \"is it above or below 50?\" Each question eliminates half. After 7 questions, you have narrowed it down to 1 number.","visual":"Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nTarget: 23\nStep 1: mid=16 (index 4) → 23 > 16 → search right\nStep 2: mid=56 (index 7) → 23 < 56 → search left\nStep 3: mid=23 (index 5) → found!","examples":["Classic: find element in sorted array — O(log n)","First/last occurrence: modify bounds on match — O(log n)","Search in rotated sorted array — O(log n)"],"complexity":{"time":"O(log n)","space":"O(1) iterative, O(log n) recursive"},"tryIt":["Implement binary search on a sorted array.","Find the first occurrence of a target in a sorted array with duplicates.","Search for a target in a rotated sorted array."],"checkUnderstanding":["Why must the array be sorted for binary search?","How do you avoid integer overflow when computing mid?","What is the difference between lower_bound and upper_bound?"],"resources":["https://visualgo.net/en/binarysearch","https://en.wikipedia.org/wiki/Binary_search_algorithm"]}', 8),

('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000001', 'dynamic-programming', 'Dynamic Programming', 'advanced',
'{"what":"Dynamic programming solves complex problems by breaking them into overlapping subproblems, solving each once, and storing results. Key properties: optimal substructure and overlapping subproblems.","why":"DP is the most powerful algorithmic paradigm. It transforms exponential brute-force into polynomial solutions for problems like shortest paths, sequence alignment, and resource allocation.","mentalModel":"Like solving a jigsaw puzzle: first solve small sections (subproblems), then combine them. DP remembers each solved section so you never redo work.","visual":"Fibonacci (naive vs DP):\nNaive:  fib(5) → fib(4) + fib(3)\n              → (fib(3)+fib(2)) + (fib(2)+fib(1))\n              → ... exponential calls\n\nDP: fib = [0,1,1,2,3,5] — fill left to right, each uses previous two\n\nKnapsack Table:\n     wt→  0   1   2   3   4\nitem↓\n  0       0   0   0   0   0\n  1(w=1)  0   1   1   1   1\n  2(w=3)  0   1   1   3   4","examples":["Climbing stairs: dp[i] = dp[i-1] + dp[i-2] — O(n)","0/1 Knapsack: dp[i][w] = max(include, exclude) — O(n·W)","Longest Common Subsequence: dp[i][j] comparing s1[i] vs s2[j] — O(m·n)"],"complexity":{"time":"varies, typically O(n²) or O(n·W)","space":"O(n²) typical, can optimize to O(n)"},"tryIt":["Solve climbing stairs with memoization and tabulation.","Implement the 0/1 knapsack problem.","Find the longest increasing subsequence."],"checkUnderstanding":["What is the difference between top-down (memoization) and bottom-up (tabulation)?","How do you identify if a problem can be solved with DP?","When can you optimize DP space from O(n²) to O(n)?"],"resources":["https://visualgo.net/en/dp","https://en.wikipedia.org/wiki/Dynamic_programming"]}', 9),

('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000001', 'recursion-backtracking', 'Recursion & Backtracking', 'intermediate',
'{"what":"Recursion is a function calling itself with a smaller input until reaching a base case. Backtracking explores all possible solutions by building candidates incrementally and undoing choices that fail.","why":"Recursion naturally expresses tree traversals, divide-and-conquer, and combinatorial problems. Backtracking solves constraint satisfaction, permutations, and puzzle problems.","mentalModel":"Recursion = Russian nesting dolls: open one, find a smaller one inside, keep going until the smallest. Backtracking = navigating a maze: try a path, if dead end, backtrack and try another.","visual":"Recursion tree for factorial(4):\nfactorial(4)\n  → 4 * factorial(3)\n    → 3 * factorial(2)\n      → 2 * factorial(1)\n        → 1 (base case)\n      ← 2\n    ← 6\n  ← 24\n← 24","examples":["Factorial: base case n=0 returns 1, else n*fact(n-1) — O(n)","Subsets: for each element, include or exclude — O(2^n)","N-Queens: place row by row, backtrack on conflicts — O(n!)"],"complexity":{"time":"O(2^n) for subsets, O(n!) for permutations","space":"O(n) recursion depth"},"tryIt":["Generate all subsets of a set.","Solve the N-Queens problem.","Generate all valid parentheses combinations."],"checkUnderstanding":["What is tail recursion and why does it matter?","How do you avoid redundant work in recursive solutions?","When is backtracking more appropriate than brute force?"],"resources":["https://en.wikipedia.org/wiki/Backtracking","https://visualgo.net/en/recursion"]}', 10);

-- ─── Path Edges (DAG ordering) ───────────────────────────────────────────
INSERT INTO path_edges (from_topic, to_topic) VALUES
('b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002'),
('b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003'),
('b1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005'),
('b1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004'),
('b1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000005'),
('b1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000006'),
('b1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000007'),
('b1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000008'),
('b1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000009'),
('b1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000009'),
('b1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000009'),
('b1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000010'),
('b1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000010');

-- ─── Problems ─────────────────────────────────────────────────────────────

INSERT INTO problems (id, slug, title, difficulty, topics, description_md, examples, constraints_md, starter_code, test_cases, source) VALUES

('c1000000-0000-0000-0000-000000000001', 'two-sum', 'Two Sum', 'easy',
 ARRAY['arrays','hash-maps'],
'Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.',
'[{"input":"nums = [2,7,11,15], target = 9","output":"[0,1]","explanation":"Because nums[0] + nums[1] == 9, we return [0, 1]."},{"input":"nums = [3,2,4], target = 6","output":"[1,2]","explanation":"nums[1] + nums[2] == 6, we return [1, 2]."}]',
'2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹\n-10⁹ ≤ target ≤ 10⁹\nOnly one valid answer exists.',
'{"python":"class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass","go":"func twoSum(nums []int, target int) []int {\n    \n}"}',
'[{"input":[2,7,11,15],"expected":[0,1]},{"input":[3,2,4],"expected":[1,2]},{"input":[3,3],"expected":[0,1]}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000002', 'valid-anagram', 'Valid Anagram', 'easy',
 ARRAY['hash-maps','strings'],
'Given two strings `s` and `t`, return `true` *if* `t` *is an anagram of* `s`, *and* `false` *otherwise*.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.',
'[{"input":"s = \"anagram\", t = \"nagaram\"","output":"true","explanation":"Both strings contain the same letters with the same frequencies."},{"input":"s = \"rat\", t = \"car\"","output":"false","explanation":"Letters differ: s has ''a'' but t does not."}]',
'1 ≤ s.length, t.length ≤ 5 × 10⁴\ns and t consist of lowercase English letters.',
'{"python":"class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass","go":"func isAnagram(s string, t string) bool {\n    \n}"}',
'[{"input":["anagram","nagaram"],"expected":true},{"input":["rat","car"],"expected":false},{"input":["a","ab"],"expected":false}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000003', 'reverse-linked-list', 'Reverse Linked List', 'easy',
 ARRAY['linked-lists'],
'Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.',
'[{"input":"head = [1,2,3,4,5]","output":"[5,4,3,2,1]","explanation":"The linked list is reversed."},{"input":"head = [1,2]","output":"[2,1]","explanation":""},{"input":"head = []","output":"[]","explanation":""}]',
'The number of nodes in the list is [0, 5000]\n-5000 ≤ Node.val ≤ 5000',
'{"python":"# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass","go":"// type ListNode struct {\n//     Val int\n//     Next *ListNode\n// }\nfunc reverseList(head *ListNode) *ListNode {\n    \n}"}',
'[{"input":[1,2,3,4,5],"expected":[5,4,3,2,1]},{"input":[1,2],"expected":[2,1]},{"input":[],"expected":[]}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000004', 'valid-parentheses', 'Valid Parentheses', 'easy',
 ARRAY['stacks-queues'],
'Given a string `s` containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.',
'[{"input":"s = \"()\"","output":"true","explanation":""},{"input":"s = \"()[]{}\"","output":"true","explanation":""},{"input":"s = \"(]\"","output":"false","explanation":""}]',
'1 ≤ s.length ≤ 10⁴\ns consists of parentheses only ''()[]{}''.',
'{"python":"class Solution:\n    def isValid(self, s: str) -> bool:\n        pass","go":"func isValid(s string) bool {\n    \n}"}',
'[{"input":"()","expected":true},{"input":"()[]{}","expected":true},{"input":"(]","expected":false},{"input":"{[]}","expected":true}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000005', 'max-subarray', 'Maximum Subarray', 'medium',
 ARRAY['dynamic-programming'],
'Given an integer array `nums`, find the subarray with the largest sum, and return *its sum*.',
'[{"input":"nums = [-2,1,-3,4,-1,2,1,-5,4]","output":"6","explanation":"The subarray [4,-1,2,1] has the largest sum 6."},{"input":"nums = [1]","output":"1","explanation":""},{"input":"nums = [5,4,-1,7,8]","output":"23","explanation":""}]',
'1 ≤ nums.length ≤ 10⁵\n-10⁴ ≤ nums[i] ≤ 10⁴',
'{"python":"class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass","go":"func maxSubArray(nums []int) int {\n    \n}"}',
'[{"input":[-2,1,-3,4,-1,2,1,-5,4],"expected":6},{"input":[1],"expected":1},{"input":[5,4,-1,7,8],"expected":23}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000006', 'binary-search', 'Binary Search', 'easy',
 ARRAY['binary-search','arrays'],
'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

You must write an algorithm with O(log n) runtime complexity.',
'[{"input":"nums = [-1,0,3,5,9,12], target = 9","output":"4","explanation":"9 exists in nums and its index is 4"},{"input":"nums = [-1,0,3,5,9,12], target = 2","output":"-1","explanation":"2 does not exist in nums so return -1"}]',
'1 ≤ nums.length ≤ 10⁴\nAll the integers in nums are unique.\nnums is sorted in ascending order.',
'{"python":"class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass","go":"func search(nums []int, target int) int {\n    \n}"}',
'[{"input":[[-1,0,3,5,9,12],9],"expected":4},{"input":[[-1,0,3,5,9,12],2],"expected":-1}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000007', 'climbing-stairs', 'Climbing Stairs', 'easy',
 ARRAY['dynamic-programming'],
'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
'[{"input":"n = 2","output":"2","explanation":"1. 1 step + 1 step\n2. 2 steps"},{"input":"n = 3","output":"3","explanation":"1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step"}]',
'1 ≤ n ≤ 45',
'{"python":"class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass","go":"func climbStairs(n int) int {\n    \n}"}',
'[{"input":2,"expected":2},{"input":3,"expected":3},{"input":4,"expected":5}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000008', 'contains-duplicate', 'Contains Duplicate', 'easy',
 ARRAY['hash-maps','arrays'],
'Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.',
'[{"input":"nums = [1,2,3,1]","output":"true","explanation":"1 appears twice."},{"input":"nums = [1,2,3,4]","output":"false","explanation":"All elements are distinct."},{"input":"nums = [1,1,1,3,3,4,3,2,4,2]","output":"true","explanation":""}]',
'1 ≤ nums.length ≤ 10⁵\n-10⁹ ≤ nums[i] ≤ 10⁹',
'{"python":"class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        pass","go":"func containsDuplicate(nums []int) bool {\n    \n}"}',
'[{"input":[1,2,3,1],"expected":true},{"input":[1,2,3,4],"expected":false},{"input":[1,1,1,3,3,4,3,2,4,2],"expected":true}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000009', 'course-schedule', 'Course Schedule', 'medium',
 ARRAY['graphs','dynamic-programming'],
'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.

Return `true` if you can finish all courses. Otherwise, return `false`.',
'[{"input":"numCourses = 2, prerequisites = [[1,0]]","output":"true","explanation":"Take course 0, then course 1."},{"input":"numCourses = 2, prerequisites = [[1,0],[0,1]]","output":"false","explanation":"There is a cycle: 0 → 1 → 0."}]',
'1 ≤ numCourses ≤ 2000\n0 ≤ prerequisites.length ≤ 5000',
'{"python":"class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        pass","go":"func canFinish(numCourses int, prerequisites [][]int) bool {\n    \n}"}',
'[{"input":[2,[[1,0]]],"expected":true},{"input":[2,[[1,0],[0,1]]],"expected":false}]',
'leetcode'),

('c1000000-0000-0000-0000-000000000010', 'merge-sort-list', 'Sort List', 'medium',
 ARRAY['linked-lists','sorting'],
'Given the `head` of a linked list, return *the list after sorting it in ascending order*.

Implement it in O(n log n) time complexity and O(1) space (i.e. constant extra space).',
'[{"input":"head = [4,2,1,3]","output":"[1,2,3,4]","explanation":""},{"input":"head = [-1,5,3,4,0]","output":"[-1,0,3,4,5]","explanation":""}]',
'The number of nodes in the list is [0, 5 × 10⁴]\n-10⁵ ≤ Node.val ≤ 10⁵',
'{"python":"# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass","go":"// type ListNode struct {\n//     Val int\n//     Next *ListNode\n// }\nfunc sortList(head *ListNode) *ListNode {\n    \n}"}',
'[{"input":[4,2,1,3],"expected":[1,2,3,4]},{"input":[-1,5,3,4,0],"expected":[-1,0,3,4,5]},{"input":[],"expected":[]}]',
'leetcode');

-- +goose Down
DELETE FROM path_edges;
DELETE FROM problems;
DELETE FROM topics;
DELETE FROM learning_paths;
