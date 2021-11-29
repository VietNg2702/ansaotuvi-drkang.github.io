function changeAction() {

    
    var hoten = "Nguyễn Duy Việt";//document.getElementById("iphovaten").value;
    var ngaysinh = "27";//document.getElementById("ipngay").value;
    var thangsinh = "2";//document.getElementById("ipthang").value;
    var namsinh = "1995";//document.getElementById("ipnam").value;
    var giosinh = "Thìn";//document.getElementById("ipgio").value;
    var gioitinh = "Nam";//document.getElementById("ipgioitinh").value;
    var lich = "true";//document.getElementById("amlich").checked;
    if((gioitinh === "Nam")||(gioitinh === "Nữ"))
    {
        document.getElementById("thongtin").action = "ansaotuvi.html";
        localStorage.hovaten = hoten;
        localStorage.ngaysinh = ngaysinh;
        localStorage.thangsinh = thangsinh;
        localStorage.namsinh = namsinh;
        localStorage.giosinh = giosinh;
        localStorage.gioitinh = gioitinh;
        localStorage.lich = lich;
    }
    else
    {
        alert("Xem lại giới tính !!");
    }
}