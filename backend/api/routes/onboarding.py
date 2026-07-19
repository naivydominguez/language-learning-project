from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

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
    try:
        user_data={
            "user_id":data.user_id,
            "name": data.preferredName,
            "study_time_goal": data.dailyGoal,
            "target_languages": len(data.targetLanguages),
            "native_language": data.nativeLanguage,
            "personality_prompt": data.immerbotPersonality,
            
        }
        user_result = (
            supabase.table("users").upsert(user_data,on_conflict="user_id",).execute()
        )
        
        print("User Id recived: ", data.user_id)
        print("User update result: ", user_result.data)
        
        language_links = []
        
        for language_name in data.targetLanguages:
            language_result = (
                supabase.table("languages").select("id","name").ilike("name",language_name).execute()
            )
            
            print(f"Language lookup for {language_name}:",language_result.data)
            
            if not language_result.data:
                raise HTTPException(status_code=400, detail="f Language {language_name} not found")
            
            language_id = language_result.data[0]["id"]
            
            language_links.append({
                "user_id":data.user_id,
                "language_id":language_id,
            })
            
        user_languages_result = (
            supabase.table("user_languages").upsert(language_links, on_conflict="user_id,language_id",).execute()
        )
        
        
        print("Language relationships",language_links)
        print("User languages result", user_languages_result.data)
        
        return{
            "success":True,
            "message": "Onboarding data recived",
            "user": user_result.data, 
            "user_languages": user_languages_result.data,
            
            
        }
    
    except HTTPException:
        raise
    except Exception as error:
        print("Onboarding error:", error)
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )
