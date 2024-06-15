import random
import datetime
import json

def generate_random_date(start, end):
    """Generate a random datetime between `start` and `end`."""
    return start + (end - start) * random.random()


def generate_logs(num_docs, user_ids, start_date, end_date):
    actions = ['login', 'logout']
    logs = []

    for _ in range(num_docs):
        log = {
            "user_id":{
                "$oid":str(random.choice(user_ids))
            },
            "action_type": str(random.choice(actions)),
            "time":{
                "$date": generate_random_date(start_date, end_date).isoformat() + 'Z'
            }
        }
        logs.append(log)

    return logs


def main():
    #num_docs = int(input("Enter the number of documents to generate: "))
    #user_ids = input("Enter user IDs separated by commas: ").split(',')

    num_docs = 500
    user_ids = ['661ee379a881e0b8999aabee', '661ee379a881e0b8999aabf0', '661ee379a881e0b8999aabf1', '661ee379a881e0b8999aabf2',
                '661ee379a881e0b8999aabed', '661ee379a881e0b8999aabef', '661ee379a881e0b8999aabf3', '661ee379a881e0b8999aabf5',
                '661ee379a881e0b8999aabf6', '666072a38c8f9f61c47ac25e', '6660c095e621e15a45c34d38']

    start_date = datetime.datetime.fromisoformat(input("Enter the start date (YYYY-MM-DD): "))
    end_date = datetime.datetime.fromisoformat(input("Enter the end date (YYYY-MM-DD): "))

    logs = generate_logs(num_docs, user_ids, start_date, end_date)

    filename = "generated_logs.json"
    with open(filename, 'w') as file:
        json.dump(logs, file, indent=4)

    print(f"Generated logs have been saved to {filename}")


if __name__ == "__main__":
    main()
