import { SearchBar } from 'ui/search-bar';


export function hideSearchKeyboard(searchBar: SearchBar) {
    if (searchBar.android) {
        searchBar.android.clearFocus();
    }
    if (searchBar.ios) {
        searchBar.ios.resignFirstResponder();
    }
}