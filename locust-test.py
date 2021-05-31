from locust import HttpUser, task, between
from datetime import datetime


class QuickstartUser(HttpUser):
    wait_time = between(1, 2.5)

    @task
    def getTopPolls_query(self):
        current_time = datetime.now().isoformat()

        self.client.post("/graphql", json={
            "operationName": "getTopPolls",
            "variables": {},
            "query": """query getTopPolls {
                getTopPolls {
                    _id
                    pollUrlId
                    question
                    options {
                        _id
                        text
                        order
                        selected
                        totalVotes
                    }
                    author {
                        _id
                        userUrlId
                        name
                        imageUrl
                        status
                    }
                    tags
                    createdDate
                    modifiedDate
                }
            }
            """})
