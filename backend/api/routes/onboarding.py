from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter
from api.utils.supabase_client import supabase

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

class OnboardingData(BaseModel):
   user_id: str
   targetLanguages: list[str]
   nativeLanguage: str
   dailyGoal: int
   preferredName: str
   immerbotPersonality: str
   selectedImportApps: list[str]
   jpdbApiKey: Optional[str] = None

@router.post("")
async def receive_onboarding_data(data:OnboardingData):
   result = (
       supabase.table("users")
       .update({
           "name": data.preferredName,
           "study_time_goal": data.dailyGoal,
           "native_language": data.nativeLanguage,
           "personality_prompt": data.immerbotPersonality,
       })
       .eq("user_id",data.user_id)
       .execute()
   )

   return {
      "success":True,
      "message": "Onboarding data recived",
      "data": result.data, 
      }
   

