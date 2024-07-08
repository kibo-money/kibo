import {
  readBooleanFromStorage,
  saveToStorage,
} from "/src/scripts/utils/storage";
import {
  readBooleanURLParam,
  writeURLParam,
} from "/src/scripts/utils/urlParams";
import { createRWS } from "/src/solid/rws";

export function createSeriesLegend<Scale extends ResourceScale>({
  id,
  presetId,
  title,
  color,
  seriesList,
  defaultVisible = true,
  disabled: _disabled,
  visible: _visible,
  dataset,
}: {
  id: string;
  presetId: string;
  title: string;
  color: Color | Color[];
  seriesList: Accessor<ISeriesApi<SeriesType> | undefined>[];
  defaultVisible?: boolean;
  disabled?: Accessor<boolean>;
  visible?: RWS<boolean>;
  dataset: ResourceDataset<Scale>;
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
    seriesList,
    color,
    visible,
    disabled,
    drawn,
    dataset,
  };
}
