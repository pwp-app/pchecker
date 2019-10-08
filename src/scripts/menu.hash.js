function popup_menu_hash(){
    var menu_hash = new Menu();
    menu_hash.append(new MenuItem({
        label: '复制',
        click: ()=>{
            copyToClipboard(copyready);
        }
    }));
    menu_hash.popup(remote.getCurrentWindow());
}