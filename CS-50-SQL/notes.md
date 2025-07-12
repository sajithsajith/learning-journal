## Create DB:
```sql
sqlite3 temp.db
```
## Create table:
```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    grade TEXT
);
```
## Insert Values:

```sql
INSERT INTO students (id, name, age, grade)
VALUES (0, 'Alice', 20, 'A');
```
## Update Values:
```sql
UPDATE students
SET age = 21, grade = 'B+'
WHERE id = 3;
```
## Delete Values:
```sql
DELETE FROM students
WHERE name = 'Alice';
```
```sql
DELETE FROM students
WHERE id = 1;
```
```sql
/*
Delete All Rows
*/
DELETE FROM students;
```

## Get Column info:
```sql
PRAGMA table_info("temp")
```
