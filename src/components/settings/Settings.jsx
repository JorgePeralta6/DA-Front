import { UsersModify } from "../users/UserModify";
import { useUserSettings } from "../../shared/hooks/useUserSetting";
import Loading from "../Loading";
import { useNavigate, useParams } from "react-router";

export const Settings = () => {

    const { userId } = useParams();

    const { userSettings, isFetching, saveSettings } = useUserSettings(userId);

    const navigate = useNavigate();

    const handleCloseModel = () => {
        navigate('/users')
    }

    if(isFetching){
        return <Loading />
    }

    return (
        <UsersModify settings={userSettings} saveSettings={saveSettings} isOpen={true} onClose={handleCloseModel}  />
    )
}
