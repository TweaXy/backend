import os
import re

def extract_model_names(prisma_file_path):
    # Define the pattern to extract model names
    with open(prisma_file_path, 'r') as prisma_file:
        prisma_content = prisma_file.read()
        pattern = r'model (\w+) {'

        # Find all matches in the Prisma content
        matches = re.findall(pattern, prisma_content)
        return matches
def capitalize_first_letter(match):
    table_name = match.group(1).lower()
    capitalized_name = table_name[0].upper() + table_name[1:]
    return f'{match.group(2)} `{capitalized_name}`'

def replace_alter_table(file_path, model_names):
    with open(file_path, 'r') as file:
        content = file.read()

        #TODO: for any model name insensitive in file replaced with model name
        for model_name in model_names:
            pattern = re.compile(re.escape(model_name), re.IGNORECASE)
            content = pattern.sub(model_name, content)
            
        with open(file_path, 'w') as file:
            file.write(content)

def process_sql_files(main_folder, model_names):
    for root, dirs, files in os.walk(main_folder):
        for file_name in files:
            print(file_name)
            if file_name.endswith('.sql'):
                file_path = os.path.join(root, file_name)
                replace_alter_table(file_path, model_names)

if __name__ == "__main__":
    main_folder = './prisma/migrations'
    # process_sql_files(main_folder)
    model_names = extract_model_names('./prisma/schema.prisma')
    process_sql_files(main_folder, model_names)
    print(model_names)