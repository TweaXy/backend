# Phase 0 Report

# Version Control

In our development process, we employ **`Git`** for version control and utilize **`Github`** as our central repository.

-   B**\*\***ranching Strategy:**\*\***
    1. **Main Branch**: This is our primary branch where we reserve the right to push releases. Prior to any pull request (PR) into the main branch, it is imperative that comprehensive testing is conducted to ensure the utmost quality and stability.
    2. **Development Branch (Dev)**: The development branch is intended for continuous integration of new features. Developers are encouraged not to wait for integration but rather regularly push their feature branches.
    3. **Feature Branches**: Feature branches are used to isolate all code changes associated with a particular feature or functionality. These branches serve as a container for work on specific features, allowing for focused development and collaboration.
    4. **Task Branches**: Task branches are created by individual team members, branching from the corresponding feature branch. These task branches are intended for the development of specific tasks within the feature. Once the task is completed, it is essential to request a review through a pull request before merging the changes into the feature branch.

# Code Review

-   utilizing **Github pull requests** and **addressing issues** raised by the team.
-   utilizing **trello** to fair division of tasks & keep track of progress of each team member
-   scrum every three days (daily in sub-team 🤥)

# 1. Basics (Tool | Language | Framework)

### Language (`Nodejs`)

| Pros                                                   | Cons                                                                        |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1. Previous experience                                 | 1. Node Js applications can have a larger file size due to its dependencies |
| 2. execution time is swift, and it runs very quickly   | 2. Lack of complex tools and frameworks to build resources from templates   |
| 3. Unify Programming Language                          | 3. PHP has a higher level of security and flexibility                       |
| 4. Shorter time to market                              |                                                                             |
| 5. Most opportunities open in Egypt (Node.js, Laravel) |                                                                             |
| 6. Complete JavaScript Stack                           |                                                                             |
| 7. Large and Active Community                          |                                                                             |
| 8. More than 50,000 bundles available in the NPM       |                                                                             |
| 9. Asynchronous in Nature and Event-driven             |                                                                             |

### Framework (`express`)

| Pros                                                          | Cons          |
| ------------------------------------------------------------- | ------------- | ----------------- | ---------------------------------------------- |
| Scale quickly                                                 | Easy to learn | Community support | the new frameworks are more fast and type safe |
| previous experience                                           |               |
| alternatives are still new and have less support in community |               |

### Editor (`VScode`)

| Pros                          | Cons                 |
| ----------------------------- | -------------------- | --------------------- |
| lightweight                   | fast                 | Extensions Management |
| more customizable             | heavy resource usage |
| Unify Editor through all team | not a Full IDE       |

---

# 2. Database (**Strategy | Type | ORM)**

## **Database Strategy**

### Characteristics of Twitter (Traffic)

**This will be a read-heavy system**

> Twitter has **300M** daily active users. On average, every second **6000 tweets** are tweeted on Twitter. Every second **600000 Queries** are made to get the timelines. Each user has on average **200 followers** and some users like some celebrities have millions of followers.

This characteristic of Twitter clears the following points ⇒

1. Twitter has a **heavy read** in comparison to writing so we should care much more about the **availability** and scale of the application for the heavy read on Twitter.
2. We can consider **eventual consistency** for this kind of system. It’s completely ok if a user sees the tweet of his follower a bit delayed
3. Space is not a problem as tweets are limited to 140 characters.

### Relational & Non-Relational Databases Comparisons

| Aspect            | Relational Databases                                                                                            | Non-Relational Databases                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Data Structure    | Tabular structure with rows and columns                                                                         | Flexible data models, including key-value, document, column-family, and graph databases                                                |
| Schema            | Rigid schema with fixed tables and relationships                                                                | Dynamic schema or schema-less design, allowing for on-the-fly changes                                                                  |
| Query Language    | SQL (Structured Query Language)                                                                                 | Query languages specific to each NoSQL type (e.g., MongoDB Query Language, Cassandra Query Language)                                   |
| Scaling           | Vertical scaling (adding more resources to a single server)                                                     | Horizontal scaling (adding more servers to a distributed system)                                                                       |
| ACID Transactions | Strong support for ACID (Atomicity, Consistency, Isolation, Durability) transactions                            | Varies by NoSQL database; some provide ACID guarantees, while others prioritize eventual consistency                                   |
| Data Consistency  | Strong data consistency with transactions and constraints                                                       | Eventual consistency, tunable based on the specific NoSQL database                                                                     |
| Use Cases         | Complex, structured data with predefined schemas, suited for financial, e-commerce, and enterprise applications | Big data, real-time data, unstructured or semi-structured data, content management, IoT, social media, and other rapidly changing data |
| Development Time  | Longer development time due to schema design and normalization                                                  | Faster development time, especially for agile and rapidly evolving projects                                                            |
| Scalability       | More challenging to scale horizontally and handle high traffic                                                  | Easier to scale horizontally and adapt to changing workloads                                                                           |
| Data Integrity    | Strong data integrity and consistency                                                                           | Sacrifices some data integrity for scalability and flexibility                                                                         |
| Data Size         | Well-suited for handling moderate to large-sized datasets                                                       | Designed to handle massive amounts of data                                                                                             |
| Join Operations   | Supports complex join operations between related tables                                                         | Typically avoids join operations, focusing on retrieval from a single data store                                                       |
| Cost              | Potentially higher cost due to licensing and hardware requirements                                              | Lower cost for the same level of performance due to open-source solutions and cloud-based infrastructure                               |
| Examples          | MySQL, PostgreSQL, Oracle, SQL Server                                                                           | MongoDB, Cassandra, Redis, Neo4j, Couchbase                                                                                            |

### **Conclusion ⇒ (Relational Database)**

In an ideal scenario, the utilization of both Non-Relational and Relational Databases would be optimal for our project. However, due to project time constraints, we have made the strategic decision to exclusively employ a Relational Database at this juncture, with the potential consideration of integrating Non-Relational Databases for caching purposes in the future.

### References

-   [Dev.to ⇒ **System Design: Twitter**](https://dev.to/karanpratapsingh/system-design-twitter-865)
-   [GeeksForGeeks ⇒ **Design Twitter – A System Design Interview Question**](https://www.geeksforgeeks.org/design-twitter-a-system-design-interview-question/)
-   chat GPT for comparison table with some google search

## Database Management System: `Mysql`

### Comparison between most Famous Database Systems

|                           | Mysql                                                             | PostgreSQL                                                                     |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Data Types                | support fewer data types                                          | support more types                                                             |
| Window Functions          | support some aggregate functions                                  | support all aggregate functions                                                |
| ORDBMS vs. RDBMS          | RDBMS                                                             | (ORDBMS ) already support object relational mapping \*supported more in prisma |
| Full-Text Search          | limited                                                           | Robust full-text search support using text search functions                    |
| Use Case: Web Application | Widely for its speed and reliability                              | Growing in popularity                                                          |
| Previous experience       | yes                                                               | no                                                                             |
| performance               | MySQL has improved performance for high-frequency read operations | PostgreSQL has improved performance for high-frequency write operations        |
| complexity                | more simpler than PostgreSQL                                      |                                                                                |

### References

-   [PostgreSQL vs MySQL: The Critical Differences](https://www.integrate.io/blog/postgresql-vs-mysql-which-one-is-better-for-your-use-case/)
-   [What’s the Difference Between MySQL and PostgreSQL?](https://aws.amazon.com/compare/the-difference-between-mysql-vs-postgresql/#:~:text=MySQL%20has%20improved%20performance%20for,for%20high%2Dfrequency%20write%20operations.&text=MySQL%20is%20easier%20to%20get,set%20for%20non%2Dtechnical%20users.)
-   chatGPT

## Database ORM Framework: `Prisma`

`**ORM`** stands for **Object-Relational Mapping\*\* and it is a technique used to simplify database operations in backend projects. In a Node.js backend project, ORM frameworks like Prisma are commonly used to interact with databases.

Here are some reasons why we use ORM in a Node.js backend project:

1. **Abstraction of database operations**: ⇒ This abstraction makes it easier to work with databases without having to write raw SQL queries.
2. **Productivity and efficiency**: ORM frameworks provide a set of APIs and methods that handle the underlying database operations.
3. **Cross-database compatibility**: ORM frameworks often support multiple database systems, allowing developers to switch between different databases without significant code changes.
4. **Query optimization and performance**: ORM frameworks like Prisma generate optimized database queries based on the defined models and relationships.
5. **Security**: ORM frameworks provide built-in protections against common security vulnerabilities, such as SQL injection attacks. They handle parameterization and escaping of user inputs, reducing the risk of malicious code execution.

### ORM Framework Comparison

| Aspect         | Prisma                                                                      | Sequelize                                                                                  | Objection                                                                  |
| -------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Query Language | Prisma Query Language (PQL)                                                 | SQL-based queries with a fluent API                                                        | SQL-based queries with a fluent API                                        |
| Type Safety    | Strong type safety with generated types                                     | Less type safety                                                                           | Less type safety                                                           |
| Performance    | More Performance than others                                                | Good performance                                                                           | Good performance                                                           |
| Ease of Use    | Easy to use with clear and concise syntax                                   | Relatively easy to use with flexible configuration                                         | Relatively easy to use with flexible configuration                         |
| Documentation  | Well-documented with a user-friendly website                                | Comprehensive documentation with examples                                                  | Comprehensive documentation with examples                                  |
| Migrations     | Support                                                                     | Support                                                                                    | Support                                                                    |
| Community      | Active                                                                      | Active                                                                                     | Active                                                                     |
| Popularity     | Gaining popularity                                                          | Popular                                                                                    | Popular                                                                    |
| Features       | Provides a powerful and intuitive query API with data modeling capabilities | Provides a wide range of features including query building, associations, and transactions | Provides flexible query building and supports advanced database operations |
| limitations    | CHECK constraint Must write by hand                                         |                                                                                            |                                                                            |
| Schema         | More Declarative                                                            |                                                                                            |                                                                            |
| best use case  |                                                                             | More Mature than others                                                                    | if you prefer writing pure SQL                                             |

### References

-   [Battle of the Node.js ORMs: Objection vs. Prisma vs. Sequelize](https://www.bitovi.com/blog/battle-of-the-node.js-orms-objection-prisma-sequelize)
-   [7 Best and Worst ORM for Node.js in 2023](https://www.eversql.com/best-orm-for-node-js/?ref=dailydev)
-   GPT4

## Database Practices

1. **\*\***\*\***\*\***All Data to be in Third Normalized Form (**\*\***\*\***\*\***
2. \***\*Apply consistent formatting\*\***
    1. Tables (Models in Prisma)
        - Model names must adhere to the following regular expression: **`[A-Za-z][A-Za-z0-9_]*`**
        - Model names must start with a letter and are typically spelled in [**PascalCase**](https://wiki.c2.com/?PascalCase)
        - Model names should use the **singular** form (for example, **`User`** instead of **`user`**, **`users`** or **`Users`**)
        - Prisma has a number of **reserved words** that are being used by Prisma internally and therefore cannot be used as a model name. You can find the reserved words [here](https://github.com/prisma/prisma/blob/main/packages/client/src/generation/generateClient.ts#L376) and [here](https://github.com/prisma/prisma-engines/blob/main/psl/parser-database/src/names/reserved_model_names.rs#L44).
    2. Columns (Fields in Prisma)
        - Must start with a letter
        - Typically spelled in **camelCase**
        - Must adhere to the following regular expression: **`[A-Za-z][A-Za-z0-9_]*`**

---

# 3. Maintenance of Clean Code

### Linter Configuration: `ESLint` with Recommended Rules

-   ESLint with recommended rules keeps our code clean and error-free.
-   It strikes a balance between strictness and flexibility.
-   Avoids the complexities of Airbnb or Google Standard styles.

### **Code Formatting: `Prettier`**

-   Prettier maintains consistent code formatting.
-   Simplifies the process with minimal configuration.
-   Reduces formatting discrepancies compared to other tools.

### Error Handling

1. use a safety net handlers for _uncaught exceptions_ and _rejected promises_.
2. sending minimal error messages in production.
3. sending general error messages when programming errors happen in production.
4. using wrapper functions to insure try-catch everywhere in code.

### Documentation: `JSDocs` and `Swagger`

-   JSDocs with Swagger provide in-code documentation for better code understanding.
-   This approach aligns with industry best practices and recognized standards.

### \***\*Deprecated Code\*\***

-   will be deleted immediately.

---

# 4. Testing

### Unit Testing: `Jest`

-   Jest is a robust and well-supported unit testing framework.
-   It simplifies the testing process with built-in features.

---

# 5. \***\*Dependency Management\*\***

Our dependency management process relies on the use of **`npm`**, **`package.json`**, and **`package-lock.json`**. These tools and files are instrumental in managing the libraries and packages that our projects depend on. They enable us to control, track, and maintain the dependencies required for our applications, ensuring stability and consistency in our software development efforts.

---

# 6. API Design Guidelines

1. \***\*Use HTTP protocols to define actions\*\***
    - eg: `**POST**`,\***\*`**GET**`\*\***,\***\*\*\*\*\*\*\***`DELETE`\***\*\*\*\*\*\*\***,**\*\***`PUT`**\*\***,**\*\*\*\***`**PATCH**`**\*\*\*\***
2. \***\*Use HTTP protocols to define actions\*\***
3. \***\*Nest hierarchy\*\***
    - eg: **`GET** /products/:productid` \*\*\*\*
    - eg: **`GET** /products/:productid/reviews` \*\*\*\*
    - eg: **`GET** /products/:product_id/reviews/:review_id` \*\*\*\*
4. \***\*Apply consistent formatting\*\***
    - `/objecttype/unique_identifier`
5. \***\*Allow sort and filter\*\***
    - filtering eg: **`/products?name="*testing*"` will get all products that contain _testing_ in them**
    - sorting eg: **`?sort=ASC`** or **`?sort=DESC`**
6. \***\*Make pagination programmable\*\***
    - eg: **`/products?name="*testing*"?limit=10?offset=10` will get second page**
7. \***\*Use JSON for the payload\*\***

\***\*reference: [16 REST API design best practices and guidelines](https://www.techtarget.com/searchapparchitecture/tip/16-REST-API-design-best-practices-and-guidelines)**

---

# 7. Project Structure

```markdown
📁 backend/
├─📄 .env
├─📄 .eslintrc.cjs
├─📄 .gitignore
├─📄 .prettierrc
├─📄 commit_template.txt
├─📁 docs/
│ ├─📁 api/
│ └─📁 function/
│ ├─📄 index.html
├─📁 images/
├─📄 jsdoc.json
├─📄 package-lock.json
├─📄 package.json
├─📁 prisma/
│ ├─📁 migrations/
│ │ ├─📁 20231019013117_test/
│ │ │ └─📄 migration.sql
│ │ └─📄 migration_lock.toml
│ ├─📄 schema.prisma
│ └─📄 seed.js
├─📄 README.md
├─📁 src/
│ ├─📄 app.js
│ ├─📁 config/
│ │ └─📄 swaggerConfig.js
│ ├─📁 controllers/
│ │ └─📄 userController.js
│ ├─📁 errors/
│ │ ├─📄 appError.js
│ │ ├─📄 globalErrorHandlerMiddleware.js
│ │ ├─📄 handleUncaughtException.js
│ │ ├─📄 handleUnhandeledRejection.js
│ │ ├─📄 sendErrorDev.js
│ │ ├─📄 sendErrorProd.js
│ │ └─📄 sendOperationalErrorProd.js
│ ├─📄 index.js
│ ├─📁 middlewares/
│ │ └─📄 validateMiddleware.js
│ ├─📄 prisma.js
│ ├─📁 routes/
│ │ └─📄 userRoutes.js
│ ├─📄 server.js
│ ├─📁 services/
│ │ └─📄 userService.js
│ ├─📁 test/
│ ├─📁 utils/
│ │ └─📄 catchAsync.js
│ └─📁 validations/
│ └─📄 testSchema.js
```

```markdown
📁 backend/
├─📄 .env
├─📄 .eslintrc.cjs
├─📄 .gitignore
├─📄 .prettierrc
├─📄 commit_template.txt
├─📄 jsdoc.json
├─📄 package-lock.json
├─📄 package.json
├─📁 docs/
│ ├─📁 api/
│ └─📁 function/
│ ├─📄 index.html
├─📁 images/
├─📁 prisma/
│ ├─📁 migrations/
│ │ ├─📁 20231019013117_test/
│ │ │ └─📄 migration.sql
│ │ └─📄 migration_lock.toml
│ ├─📄 schema.prisma
│ └─📄 seed.js
├─📄 README.md
├─📁 src/
│ ├─📄 app.js
│ ├─📄 index.js
│ ├─📄 server.js
│ ├─📁 config/
│ │ └─📄 swaggerConfig.js
│ ├─📁 controllers/
│ │ └─📄 userController.js
│ ├─📁 errors/
│ │ ├─📄 appError.js
│ │ ├─📄 globalErrorHandlerMiddleware.js
│ │ ├─📄 handleUncaughtException.js
│ │ ├─📄 handleUnhandeledRejection.js
│ │ ├─📄 sendErrorDev.js
│ │ ├─📄 sendErrorProd.js
│ │ └─📄 sendOperationalErrorProd.js
│ ├─📁 middlewares/
│ │ └─📄 validateMiddleware.js
│ ├─📄 prisma.js
│ ├─📁 routes/
│ │ └─📄 userRoutes.js
│ ├─📁 services/
│ │ └─📄 userService.js
│ ├─📁 test/
│ ├─📁 utils/
│ │ └─📄 catchAsync.js
│ └─📁 validations/
│ └─📄 testSchema.js
```

# 8. Dive Deep (Tools | Libraries)

### ER Diagram:`ERDplus` + `DBdiagram`

### Media Upload: `multer`

-   **Summary:** We opt for **`multer`** to handle media uploads, avoiding the complexities of using AWS for image hosting and relying on server-based static hosting. This approach is not only cost-effective but also streamlines the process.
-   **Cons:** While it may not be the most commonly used approach in the industry, it offers simplicity and ease of use.

### \***\*Authentication & Authorization\*\***

-   **JWT** **⇒**
-   **bcryptjs ⇒**
-   **passport** **⇒**
-   parsing using cookies

### Logger: `Morgan`

### Validator: `YUP`

### Seeding Data with: `Faker`

---

# 9. Performance Guidelines

1. **Use gzip compression ⇒** greatly decrease the size of the response body and hence increase the speed of a web app
2. **Don’t use synchronous functions**
3. **Use an init system ⇒** To ensure that your app restarts if the server crashes
4. E**xception Handling**

reference:[https://expressjs.com/en/advanced/best-practice-performance.html](https://expressjs.com/en/advanced/best-practice-performance.html)

# 10. Security Guidelines

1. **Don’t use deprecated or vulnerable versions of Express**
2. **Use Helmet ⇒** protect your app from some well-known web vulnerabilities
3. **Prevent brute-force attacks against authorization**
    - limited number of consecutive failed attempts by the same user name and IP address
4. \***\*Secure your dependencies ⇒ `npm audit`**
5. \***\*Validate the input of your users\*\***

reference:[https://expressjs.com/en/advanced/best-practice-security.html](https://expressjs.com/en/advanced/best-practice-security.html)

---

# 11. Design patterns

### 1. Singleton

-   to ensure that we have only one instance of a particular class throughout the application.

### 2. **MVC**

-   separates an application into three interconnected components: the model, the view, and the controller.
-   **Model :** determines how a database is structured
-   **View:** where end users interact within the application.
-   **Controller**:  interacts with the model and serves the response and functionality to the view.

### 3. **Module pattern**

-   allows you to organize your code into separate files or modules

### 4. Middleware

-   used for authentication/authorization of requests , validating incoming parameters and data and for logging requests.
