from dotenv.main import load_dotenv
from langchain_core.runnables import Runnable
from langchain_groq import ChatGroq
from pydantic import BaseModel

load_dotenv()

base_evaluater_llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0)


def evaluater_for[SchemaT: BaseModel](schema: type[SchemaT]) -> Runnable:
    return base_evaluater_llm.with_structured_output(
        schema,
        method="json_schema",
        strict=True,
    )
