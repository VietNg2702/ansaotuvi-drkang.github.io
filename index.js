function changeAction() {

    
    var hoten = document.getElementById("iphovaten").value;
    var ngaysinh = document.getElementById("ipngay").value;
    var thangsinh = document.getElementById("ipthang").value;
    var namsinh = document.getElementById("ipnam").value;
    var giosinh = document.getElementById("ipgio").value;
    var gioitinh = document.getElementById("ipgioitinh").value;
    document.getElementById("thongtin").action = "ansaotuvi.html";
    localStorage.hovaten = hoten;
    localStorage.ngaysinh = ngaysinh;
    localStorage.thangsinh = thangsinh;
    localStorage.namsinh = namsinh;
    localStorage.giosinh = giosinh;
    localStorage.gioitinh = gioitinh;
    
}