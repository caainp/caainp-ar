import RouteSummary from "./RouteSummary";
import { useOverlayContext } from "./OverlayContext";
import NavigationCardLoading from "../loading/NavigationCardLoading";
import NavigationCardMain from "./NavigationCardMain";

export default function NavigationCard() {
  const { isLoadingDestination, navData, handleCancelDestination } =
    useOverlayContext();

  return (
    <div className="w-full max-w-sm mx-auto pointer-events-auto bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl shadow-zinc-900">
      {/* 메인 네비게이션 카드 */}
      <div className="p-4">
        {isLoadingDestination ? (
          <NavigationCardLoading />
        ) : (
          <NavigationCardMain
            navData={navData}
            handleCancelDestination={handleCancelDestination}
          />
        )}
      </div>

      {/* 경로 요약 */}
      <RouteSummary />
    </div>
  );
}
