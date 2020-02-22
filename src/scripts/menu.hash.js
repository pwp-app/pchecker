function popup_menu_hash(){
    var menu_hash = new Menu();
    menu_hash.append(new MenuItem({
        label: i18n('menu.copy'),
        click: ()=>{
            copyToClipboard(copyready, {
                success: function(){
                    toastr.success(i18n('copy.success'));
                }
            });
        }
    }));
    menu_hash.append(new MenuItem({
        label: i18n('menu.verfiy'),
        click: ()=>{
            ipcRenderer.send('hash-verify');
        }
    }));
    menu_hash.popup(remote.getCurrentWindow());
}