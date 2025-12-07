from pydantic_ai import Agent
from dotenv import load_dotenv

# load_dotenv()


agent = Agent('openai:gpt-5-mini')

result = agent.run_sync("Write a poem about the sea.")

print(result)