from pydantic import BaseModel, ConfigDict

class AdminBase(BaseModel):
    pass


class AdminCreate(AdminBase):
    pass


class Admin(AdminBase):
    id: int
    userId: int

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )
