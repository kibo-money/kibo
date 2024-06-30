import {
  readBooleanFromStorage,
  saveToStorage,
} from "/src/scripts/utils/storage";
import {
  readBooleanURLParam,
  writeURLParam,
} from "/src/scripts/utils/urlParams";
import { createRWS } from "/src/solid/rws";

export function createSeriesLegend({
  id,
  presetId,
  title,
  color,
  series,
  defaultVisible = true,
  disabled: _disabled,
  visible: _visible,
  url,
}: {
  id: string;
  presetId: string;
  title: string;
  color: Accessor<string | string[]>;
  series: ISeriesApi<SeriesType>;
  defaultVisible?: boolean;
  disabled?: Accessor<boolean>;
  visible?: RWS<boolean>;
  url?: string;
}) {
  const storageID = `${presetId}-${id}`;

  const visible =
    _visible ||
    createRWS(
      readBooleanURLParam(id) ??
        readBooleanFromStorage(storageID) ??
        defaultVisible,
    );

  const disabled = createMemo(_disabled || (() => false));

  const drawn = createMemo(() => visible() && !disabled());

  createEffect(() => {
    series.applyOptions({
      visible: drawn(),
    });
  });

  createEffect(() => {
    if (disabled()) {
      return;
    }

    const v = visible();

    if (v !== defaultVisible) {
      writeURLParam(id, v);
      saveToStorage(storageID, v);
    } else {
      writeURLParam(id, undefined);
      saveToStorage(storageID, undefined);
    }
  });

  return {
    id,
    title,
    series,
    color,
    visible,
    disabled,
    drawn,
    url,
  };
}
