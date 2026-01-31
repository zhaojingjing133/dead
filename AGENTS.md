

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>database-design</name>
<description>Designs database schemas from business workflows for mini-programs or apps. Analyzes business entities and relationships, produces 3NF table structures with PK/FK/UK, and outputs design docs with ER diagrams (e.g. Mermaid) and DDL. Use when the user asks for database design, 数据库设计, schema design, table structure from 业务说明/业务流程, or to convert business logic into a database model.</description>
<location>project</location>
</skill>

<skill>
<name>frontend-design</name>
<description>Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.</description>
<location>project</location>
</skill>

<skill>
<name>frontend-dev</name>
<description>Develops frontend pages and mini-program UIs as a frontend expert; especially skilled in UniApp (uniapp) mini-program projects. Drafts API requirement documents and interface specs to guide backend development. Use when the user asks for frontend development, 前端开发, uniapp/小程序页面, page development, or to create 接口需求文档/接口需求 for backend.</description>
<location>project</location>
</skill>

<skill>
<name>backend-dev</name>
<description>Develops Node.js backend services as a backend expert based on API/interface requirements and database design. Produces standard, complete formal API documentation. Use when the user asks for backend development, 后端开发, Node.js API, server implementation, or 接口文档/API 文档 output.</description>
<location>project</location>
</skill>

<skill>
<name>git-commits</name>
<description>Generates Conventional Commits–compliant Git commit messages and performs pre-commit code quality audit (naming, redundancy, security). Checks doc and dependency sync (README, requirements.txt, package.json, .gitignore). Use when the user asks for commit message, 提交信息, Conventional Commits, code review before commit, 代码提交, or Git 规范.</description>
<location>project</location>
</skill>

<skill>
<name>skill-creator</name>
<description>Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
