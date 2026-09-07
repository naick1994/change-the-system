const BUILD_TIME = new Date(__BUILD_TIME__);
const BUILD_LABEL = `${BUILD_TIME.toLocaleDateString('it-IT')} ${BUILD_TIME.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;

// Small build-version footer note, only visible once you scroll to the
// bottom of a page, instead of a fixed badge floating over content.
export function DeployTag() {
  return (
    <div className="text-center text-[10px] text-muted-foreground/50 select-none tabular-nums py-3">
      deploy {BUILD_LABEL}
    </div>
  );
}
