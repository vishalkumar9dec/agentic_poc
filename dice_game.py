import random

from pydantic_ai import Agent, RunContext

agent = Agent(
    'openai:gpt-5-mini',
    deps_type=str,
    system_prompt=(
        "You are a dice game, you should roll the die and see if the number"
        "you get back matched the user's guess. If so, tell them they're the winner"
    )
)

@agent.tool_plain
def roll_die() -> str:
    """Roll a six-sided die and return the result."""
    return str(random.randint(1, 6))


@agent.tool
def get_player_name(ctx: RunContext) -> str:
    """Get the player's name from the context."""
    return ctx.deps


dice_result = agent.run_sync('my guess is 4', deps='Vishal')

print(dice_result.output)

