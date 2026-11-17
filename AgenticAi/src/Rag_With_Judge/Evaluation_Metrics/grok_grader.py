from langchain_core.runnables import Runnable
from pydantic import BaseModel

from src.Rag_With_Judge.aws import llm_client

# the judge uses the same AWS credentials and Bedrock model as the RAG bot
base_evaluater_llm = llm_client()


def evaluater_for[SchemaT: BaseModel](schema: type[SchemaT]) -> Runnable:
    return base_evaluater_llm.with_structured_output(schema)
