import random
import datetime
import json

num_docs = 100
user_ids = ['661ee379a881e0b8999aabee', '661ee379a881e0b8999aabf0', '661ee379a881e0b8999aabf1',
            '661ee379a881e0b8999aabf2',
            '661ee379a881e0b8999aabed', '661ee379a881e0b8999aabef', '661ee379a881e0b8999aabf3',
            '661ee379a881e0b8999aabf5',
            '661ee379a881e0b8999aabf6', '666072a38c8f9f61c47ac25e', '6660c095e621e15a45c34d38',
            '666dc53a7404125b0ca0c778', '666dc43d7404125b0ca0c76c', '666dc4036ee1273c66cca21a', '666dc45a7404125b0ca0c770',
            '666dc3df6ee1273c66cca216']
products_ids = ['661edcb6a881e0b8999aabcb', '661edcb6a881e0b8999aabc9', '661edcb6a881e0b8999aabe1',
                '661edcb6a881e0b8999aabcc',
                '661edcb6a881e0b8999aabd5', '661edcb6a881e0b8999aabcf', '661edcb6a881e0b8999aabd9',
                '661edcb6a881e0b8999aabe2',
                '661edcb6a881e0b8999aabe4', '661edcb6a881e0b8999aabd4', '661edcb6a881e0b8999aabd7',
                '661edcb6a881e0b8999aabda',
                '661edcb6a881e0b8999aabde', '661edcb6a881e0b8999aabd3', '661edcb6a881e0b8999aabd1',
                '661edcb6a881e0b8999aabd6',
                '661edcb6a881e0b8999aabdb', '661edcb6a881e0b8999aabdf', '661edcb6a881e0b8999aabe3',
                '661edcb6a881e0b8999aabcd']

currencies = ['PLN', 'EUR', 'USD']

payment_methods = ['Credit Card', 'Blik', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Cryptocurrencies']

status = [
    'rejected',
    'completed',
    'canceled',
    'in_progress'
]
delivery_status = [
    'order_placed',
    'delivered',
    'on_the_way'
]
def generate_random_date(start, end):
    """Generate a random datetime between `start` and `end`."""
    return start + (end - start) * random.random()


def generate_products_list():
    products_number = random.randint(1, 10)
    products = []

    for _ in range(products_number):
        chosen = str(random.choice(products_ids))  # Wybierz losowy identyfikator produktu
        products.append({"$oid": chosen})

    return products


def generate_baskets(start_date, end_date):
    baskets = []

    for _ in range(num_docs):
        basket = {
            "user_id":{
                "$oid":str(random.choice(user_ids))
            },
            "date_time":{
                "$date": generate_random_date(start_date, end_date).isoformat() + 'Z'
            },
            "products" : generate_products_list(),
            "transaction":{
                "currency" : str(random.choice(currencies)),
                "payment_method": str(random.choice(payment_methods)),
                "status": str(random.choice(status)),
                "timestamp": {
                    "$date": generate_random_date(start_date, end_date).isoformat() + 'Z'
                }
            },
            "delivery_status": str(random.choice(delivery_status)),

        }
        baskets.append(basket)

    return baskets


def main():
    #num_docs = int(input("Enter the number of documents to generate: "))
    #user_ids = input("Enter user IDs separated by commas: ").split(',')



    start_date = datetime.datetime.fromisoformat(input("Enter the start date (YYYY-MM-DD): "))
    end_date = datetime.datetime.fromisoformat(input("Enter the end date (YYYY-MM-DD): "))

    baskets = generate_baskets( start_date, end_date)

    filename = "generated_baskets.json"
    with open(filename, 'w') as file:
        json.dump(baskets, file, indent=4)

    print(f"Generated logs have been saved to {filename}")


if __name__ == "__main__":
    main()
