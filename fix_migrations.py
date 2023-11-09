import os
import re

def replace_alter_table(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

        # Replace ALTER TABLE `tablename` with ALTER TABLE `TableName`
        pattern = r'TABLE `(\w+)`'
        modified_sql = re.sub(pattern, lambda match: f'TABLE `{match.group(1).capitalize()}`', content)
        with open(file_path, 'w') as file:
            file.write(modified_sql)

def process_sql_files(main_folder):
    for root, dirs, files in os.walk(main_folder):
        for file_name in files:
            if file_name.endswith('.sql'):
                file_path = os.path.join(root, file_name)
                replace_alter_table(file_path)

if __name__ == "__main__":
    main_folder = './src/prisma/migrations'
    process_sql_files(main_folder)
