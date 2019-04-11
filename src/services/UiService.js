import UiAction from '../actions/UiAction';
import BlockingAction from '../actions/BlockingActions';

class UiService {

    changePropertyTab(data) {
        setTimeout(()=>{
            UiAction.changePropertyTab(data);
        });
    }

    changeNavTab(data) {
        setTimeout(() => {
            UiAction.changeNavTab(data);
        });
    }

    changeDashboardTab(data) {
        setTimeout(() => {
            UiAction.changeDashboardTab(data);
        });
    }

    showLoader() {
        BlockingAction.block();
    }

    hideLoader() {
        BlockingAction.unblock();
    }

    showLoader() {
        BlockingAction.block();
    }

    hideLoader() {
        BlockingAction.unblock();
    }

}

export default new UiService();