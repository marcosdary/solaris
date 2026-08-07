import { useNavigate } from "react-router-dom";

export function usePageNavigation() {
  const navigate = useNavigate();
  const navigateFor = (pageDestination: string) => {
    navigate(pageDestination);
    return; 
  }
  return navigateFor;
}