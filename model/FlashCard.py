# main.py
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# # Define the FlashCard class
# class FlashCard:
#     def __init__(self, question, answer):
#         self.question = question
#         self.answer = answer.lower()
#         self.status_answer = False

#     def check_answer(self, submit):
#         submit = submit.lower()
#         if self.answer == submit:
#             self.mark_status_already_review()
#             return True
#         else:
#             return False

#     def mark_status_already_review(self):
#         self.status_answer = True

#     def get_answer(self):
#         return self.answer

#     def get_question(self):
#         return self.question

#     def get_status_answer(self):
#         return self.status_answer

# # FastAPI app instance
# app = FastAPI()

# # CORS middleware configuration
# origins = [
#     "*"  # If you're running the frontend on port 3000 (React or other frontend apps)
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # Allows specific origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allows all headers
# )

# # Pydantic model to receive data from JavaScript
# class FlashCardInput(BaseModel):
#     question: str
#     answer: str

# # API endpoint to receive the data from JavaScript and create a FlashCard instance
# @app.post("/create-flashcard/")
# async def create_flashcard(input_data: FlashCardInput):
#     flashcard = FlashCard(input_data.question, input_data.answer)
#     print(flashcard.get_question() , flashcard.get_answer())
#     return {
#         "message": f"FlashCard created with question: '{flashcard.get_question()}' and answer: '{flashcard.get_answer()}'"
#     }

# # Root route
# # @app.get("/")
# # def read_root():
# #     return {"message": "Welcome to the FlashCard API!"}
