import boto3
from langchain_aws import BedrockEmbeddings
from langchain_aws.chat_models import ChatBedrockConverse

from src.Rag_With_Judge.constants import (
    AWS_REGION,
    AWS_ROLE_ARN,
    EMBEDDING_MODEL,
    LLM_MODEL,
    ROLE_SESSION_NAME,
)


def _bedrock_client():
    base_session = boto3.Session(region_name=AWS_REGION)
    if not AWS_ROLE_ARN:
        return base_session.client("bedrock-runtime")

    creds = base_session.client("sts").assume_role(
        RoleArn=AWS_ROLE_ARN, RoleSessionName=ROLE_SESSION_NAME
    )["Credentials"]
    return boto3.Session(
        aws_access_key_id=creds["AccessKeyId"],
        aws_secret_access_key=creds["SecretAccessKey"],
        aws_session_token=creds["SessionToken"],
        region_name=AWS_REGION,
    ).client("bedrock-runtime")


def embedding_client() -> BedrockEmbeddings:
    return BedrockEmbeddings(model_id=EMBEDDING_MODEL, client=_bedrock_client())


def llm_client() -> ChatBedrockConverse:
    return ChatBedrockConverse(
        model=LLM_MODEL,
        client=_bedrock_client(),
        temperature=0,
    )
