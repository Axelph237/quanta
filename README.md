# Quantum Education Using Sudoku
## Purpose Statement
The purpose of this repository is to create a small blog-style website for teaching Quantum Computing topics. The topic that will be demonstrated in this project is Grover's algorithm, using the sudoku problem as a learning tool. 

# 📝 Scratchpad for me :)
## Problems with Quantum Computing education

- It's treated like it's impossible to understand 
- It often either sticks so firmly to metaphor that it's wrong, or it is so theoretical it's hard to grasp

## UI/UX Design references
1. Meant for adults, not children
2. Still intending to be fun and approachable
3. Kurzgesagt does a great job of using cute visuals to convey their ideas (I do not have the capacity to do it that well)
4. For the time being only a couple pages are needed
    - Single document style (like a blog) or multiple sections on different "pages" (like a course)?
5. Small tutor mascot to keep the user engaged
    - Maybe tutor can send requests to an LLM to explain some content a user might be lost on
        - This would require users to be able to have accounts
        - The website would also need a backend
        - Likely also a database for storing responses
6. Interactive buttons, diagrams, and more
    - Very few entirely still images for explaining things
7. Progress bar for showing progress through page
8. Timeline bar for showing what section a user is on and for quickly jumping between sections

## Architecture Design ideas
1. A preprocessed markdown interpreter so I write sections in markdown rather than in the HTML itself. (remark, maybe Next.js MDX)
2. SSR -> Next.js
3. Typescript
4. If using a backend (almost guaranteed): express.js
5. MongoDB for speed
