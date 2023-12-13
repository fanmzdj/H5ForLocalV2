import db from "../mydatabase.js";
import Dexie from "Dexie";
import {
  ADD_ERROR_CODE,
  DELETE_ERROR_CODE,
  SELECT_ERROR_CODE,
  UPDATE_ERROR_CODE,
  SUCCESS_ITEM,
} from "../errorCode.js";
import { strokeHistoryModal } from "../modal/strokeHistory.js";

const _add = (dataList) => {
  return db.strokeHistoryTable
    .bulkAdd(dataList)
    .then((lastKey) => {
      console.log("Last raindrop's id was: " + lastKey);
      return { ...SUCCESS_ITEM, id: lastKey };
    })
    .catch(Dexie.BulkError, (e) => {
      console.error(
        e.failures.length + " strokeHistoryTable was added unsuccessfully"
      );
      return { code: ADD_ERROR_CODE, msg: e };
    });
};
const _delete = (id) => {
  return db.strokeHistoryTable
    .delete(parseInt(id))
    .then(() => {
      console.log(id + " book deleted");
    })
    .catch((errMsg) => {
      return { code: DELETE_ERROR_CODE, msg: errMsg };
    });
};
const _update = (id, bookItem) => {
  return db.strokeHistoryTable
    .update(parseInt(id), bookItem)
    .then((updated) => {
      if (updated) {
        console.log(id + " updated");
      } else {
        console.log("Nothing was updated");
      }
      return updated;
    })
    .catch((errMsg) => {
      return { code: UPDATE_ERROR_CODE, msg: errMsg };
    });
};
const _select = () => {
  let tmpList = [];
  return db.strokeHistoryTable
    .orderBy('updatedTime')
    .reverse()
    .each((item) => {
      tmpList.push(item);
    })
    .then(() => {
      return tmpList;
    })
    .catch((errMsg) => {
      return { code: SELECT_ERROR_CODE, msg: errMsg };
    });
};
const _get = (id) => {
  return db.strokeHistoryTable
    .get(parseInt(id))
    .then((item) => {
      return item;
    })
    .catch((errMsg) => {
      return { code: SELECT_ERROR_CODE, msg: errMsg };
    });
};

const strokeHistoryTable = {
  modal: strokeHistoryModal,
  add: _add,
  delete: _delete,
  update: _update,
  select: _select,
  get: _get,
};

export default strokeHistoryTable;
