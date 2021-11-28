const AnTuVi = [
    ["Tử Vi, Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Liêm Trinh, Thiên Tướng", "Thiên Lương", "Thất Sát", "Thiên Đồng", "Vũ Khúc", "Thái Dương","Phá Quân", "Thiên Cơ"],
    ["Thiên Cơ, Thái Âm", "Tử Vi, Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Liêm Trinh, Thất Sát", " ", " ", "Thiên Đồng", "Vũ Khúc, Phá Quân", "Thái Dương", "Thiên Phủ"],
    ["Tham Lang", "Cự Môn, Thiên Cơ", "Tử Vi, Thiên Tướng", "Thiên Lương", "Thất Sát", " ", "Liêm Trinh", " ", "Phá Quân", "Thiên Đồng", "Vũ Khúc, Thiên Phủ", "Thái Dương, Thái Âm"],
    ["Thái Dương, Cự Môn", "Thiên Tướng", "Thiên Cơ, Thiên Lương", "Tử Vi, Thất Sát", " ", " ", " ", "Liêm Trinh, Phá Quân", " ", "Thiên Phủ", "Thiên Đồng, Thái Âm", "Vũ Khúc, Tham Lang"],
    ["Vũ Khúc, Thiên Tướng", "Thái Dương, Thiên Lương", "Thất Sát", "Thiên Cơ", "Tử Vi", " ", "Phá Quân", " ", "Liêm Trinh, Thiên Phủ", "Thái Âm", "Tham Lang", "Thiên Đồng, Cự Môn"],
    ["Thiên Đồng, Thiên Lương", "Vũ Khúc, Thất Sát", "Thái Dương", " ", "Thiên Cơ", "Tử Vi, Phá Quân", " ", "Thiên Phủ", "Thái Âm", "Liêm Trinh, Tham Lang", "Cự Môn", "Thiên Tướng"],
    ["Thất Sát", "Thiên Đồng", "Vũ Khúc", "Thái Dương", "Phá Quân", "Thiên Cơ", "Tử Vi, Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Liêm Trinh, Thiên Tướng", "Thiên Lương"],
    [" ", " ", "Thiên Đồng", "Vũ Khúc, Phá Quân", "Thái Dương", "Thiên Phủ", "Thiên Cơ, Thái Âm", "Tử Vi, Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Liêm Trinh, Thất Sát"],
    ["Liêm Trinh", " ", "Phá Quân", "Thiên Đồng", "Vũ Khúc, Thiên Phủ", "Thái Dương, Thái Âm", "Tham Lang", "Thiên Cơ, Cự Môn", "Tử Vi, Thiên Tướng", "Thiên Lương", "Thất Sát", " "],
    [" ", "Liêm Trinh, Phá Quân", " ", "Thiên Phủ", "Thiên Đồng, Thái Âm", "Vũ Khúc, Tham Lang", "Thái Dương, Cự Môn", "Thiên Tướng", "Thiên Cơ, Thiên Lương", "Tử Vi, Thất Sát", " ", " "],
    ["Phá Quân", " ", "Liêm Trinh, Thiên Phủ", "Thái Âm", "Tham Lang", "Thiên Đồng, Cự Môn", "Vũ Khúc, Thiên Tướng", "Thái Dương, Thiên Lương", "Thất Sát", "Thiên Cơ", "Tử Vi", " "],
    [" ", "Thiên Phủ", "Thái Âm", "Liêm Trinh, Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Đồng, Thiên Lương", "Vũ Khúc, Thất Sát", "Thái Dương", " ", "Thiên Cơ", "Tử Vi, Phá Quân"]
    ]
const AnTrangSinh = ["Tràng sinh", "Dưỡng", "Thai", "Tuyệt", "Mộ", "Tử", "Bệnh", "Suy", "Đế Vượng", "Lâm Quan", "Quan Đới", "Mộc Dục"];
const AnThaiTue = ["Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"];
const AnLocTon = [ "Lộc Tồn, Bác Sỹ", "Lực Sỹ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu thư", "Phi Liêm", "Hỷ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"];
const idDaiVan = ["DaiVan1","DaiVan2","DaiVan3","DaiVan4","DaiVan5","DaiVan6","DaiVan7","DaiVan8","DaiVan9","DaiVan10","DaiVan11","DaiVan12"];
const idTieuVan = ["TieuVan1","TieuVan2","TieuVan3","TieuVan4","TieuVan5","TieuVan6","TieuVan7","TieuVan8","TieuVan9","TieuVan10","TieuVan11","TieuVan12"];
const CungDiaBan = ["Dần Mộc +", "Mão Mộc -", "Thìn Thổ +", "Tỵ Hỏa -", "Ngọ Hỏa +", "Mùi Thổ -", "Thân Kim +", "Dậu Kim -", "Tuất Thổ +", "Hợi Thủy -", "Tý Thủy +", "Sửu Thổ -"];
const CungMenh = ["MỆNH VIÊN", "PHỤ MẪU", "PHÚC ĐỨC", "ĐIỀN TRẠCH", "QUAN LỘC", "NÔ BỘC", "THIÊN DI", "TẬT ÁCH", "TÀI BẠCH", "TỬ TỨC", "PHU THÊ", "HUYNH ĐỆ"];
const ThienCan = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const DiaChi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const Cuc = ["Thủy Nhị Cục", "Mộc Tam Cục", "Kim Tứ Cục", "Thổ Ngũ Cục", "Hỏa Lục Cục"];
const ngayThuyNhiCuc = [[2,3,26,27], [4,5,28,29], [6,7,30], [8,9], [10,11], [12,13], [14,15], [16,17], [18,19], [20,21], [22,23], [1,24,25]];
const ngayMocTamCuc = [[5,3],[6,8],[1,9,11],[4,12,14],[7,17,15],[10,20,18],[13,21,23],[16,24,26],[19,27,29],[22,30],[25],[2,28]];
const ngayKimTuCuc = [[4,7,13],[8,11,17],[2,12,15,21],[6,16,19,25],[10,20,23,29],[14,24,27],[18,28],[22],[26],[1,30],[5],[3,9]];
const ngayThoNguCuc = [[5,9,17],[10,14,22],[3,15,19,27],[8,20,24],[1,13,25,29],[6,18,30],[11,23],[16,28],[21],[2,26],[7],[4,12]];
const ngayHoaLucCuc = [[6,11,21],[12,17,27],[4,18,23],[10,24,29],[2,16,30],[8,22],[14,28],[1,20],[7,26],[3,13],[9,19],[5,15,25]];

var viTriThan;
var ViTriMenh;
var ViTriTuVi;

window.onload = function() {
//Tải Cung Địa Bàn
for (let i = 0; i < 12; i++) {
    let id = "CungDiaBan" + (i + 1);
    document.getElementById(id).innerHTML = CungDiaBan[i].toString();
}

//Tải Thiên Bàn
document.getElementById("hovaten").innerHTML = "Nguyễn Duy Việt";
document.getElementById("ngaysinh").innerHTML = "27/02/1995";


//Định Cung Mạng, Thân, và các Cung khác
dinhCungMangThan(5,2);

//Định Cục
var cuc = dinhCuc("Ất", "Hợi");

//Tìm Bản Mệnh
document.getElementById("BanMenh").innerHTML = timBanMenh("Ất", "Hợi");

//Tính Đại vận, Tiểu Vận
tinhDaiTieu("Nam", "Hợi", cuc);

//An Tử Vi
anTuVi("Thổ Ngũ Cục", 27);

//An Tràng Sinh
anTrangSinh("Thổ Ngũ Cục", "Nam");

//An Thái Tuế
anThaiTue("Hợi");

//An Lộc Tồn
anLocTon("Ất", "Nam");

}
function changeAction() {
    document.getElementById("thongtin").action = "ansaotuvi.html";
    document.thongtin.submit();
}

function dinhCungMangThan(gioSinh, thangSinh)
{
    //Định Cung Thân
    viTriThan = (thangSinh + gioSinh)%12 - 2;

    //Định Cung Mệnh
    if(thangSinh == gioSinh) ViTriMenh = 0;
    else if(thangSinh > gioSinh) ViTriMenh = (thangSinh - gioSinh);
    else if(thangSinh < gioSinh) ViTriMenh = (12 + thangSinh - gioSinh)

    //Tải Cung Mệnh
    for(let i = 0; i < 12 ; i++)
    {
        let index = i + ViTriMenh;
        if(index > 11) index = index - 12;
        
        let id = "CungMenh" + (index + 1);
        document.getElementById(id).innerHTML = CungMenh[i].toString();
        if(index == viTriThan)
        {
            document.getElementById("CungThan").innerHTML = "Thân tại: " + CungMenh[i].toString();
        }
    }
}

function dinhCuc(Can, Chi)
{
    switch(Chi)
    {
        case "Tý":
        case "Sửu":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
            }
        }break;
        case "Dần":
        case "Mão":
        case "Tuất":
        case "Hợi":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
            }
        }break;
        case "Thìn":
        case "Tỵ":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
            }
        }break;
        case "Ngọ":
        case "Mùi":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
            }
        }break;
        case "Thân":
        case "Dậu":
        {
            switch(Can)
            {
                case "Giáp":
                case "Kỷ":
                {
                    document.getElementById("Cuc").innerHTML = "Kim Tứ Cục";
                    return "Kim Tứ Cục";
                }break;
                case "Ất":
                case "Canh":
                {
                    document.getElementById("Cuc").innerHTML = "Thủy Nhị Cục";
                    return "Thủy Nhị Cục";
                }break;
                case "Bính":
                case "Tân":
                {
                    document.getElementById("Cuc").innerHTML = "Hỏa Lục Cục";
                    return "Hỏa Lục Cục";
                }break;
                case "Đinh":
                case "Nhâm":
                {
                    document.getElementById("Cuc").innerHTML = "Thổ Ngũ Cục";
                    return "Thổ Ngũ Cục";
                }break;
                case "Mậu":
                case "Quý":
                {
                    document.getElementById("Cuc").innerHTML = "Mộc Tam Cục";
                    return "Mộc Tam Cục";
                }break;
            }
        }break;
    }
}

function timBanMenh(Can, Chi)
{
    switch(Can + ' ' + Chi)
    {
        case "Giáp Tý":
        case "Ất Sửu": 
        return "Hải trung kim (vàng đáy biển)";
        case "Bính Dần": 
        case "Đinh Mão": 
        return "Lô trung Hỏa (lửa trong lò);"
        case "Mậu Thìn": 
        case "Kỷ Mão": 
        return "Đại lâm mộc (cây ở trong rừng)";
        case "Canh Ngọ": 
        case "Tân Mùi": 
        return "Lộ bàng thổ (đất bên đường)";
        case "Nhâm Thân": 
        case "Quý Dậu": 
        return "Kiếm phong kim (vàng đầy gươm)";
        case "Giáp Tuất": 
        case "Ất Hợi": 
        return "Sơn đầu hỏa (lửa đầu núi)";
        case "Bính Tý": 
        case "Đinh Sửu": 
        return "Giản hạ thủy (nước khe suối)";
        case "Mậu Dần": 
        case "Kỷ Mão": 
        return "Thành đầu thổ (đất đầu thành)";
        case "Canh Thìn": 
        case "Tân Tỵ": 
        return "Bạch lạp kim (đèn nến trắng)";
        case "Nhâm Ngọ": 
        case "Quý Mùi":  
        return "Dương liễu mộc (cây dương liễu)";
        case "Giáp Thân": 
        case "Ất Dậu":
        return "Tuyền trung thủy (nước giữa suối)";
        case "Bính Tuất":
        case "Đinh Hợi" : 
        return "Ốc thượng thổ (đất mái nhà);"
        case "Mậu Tý": 
        case "Kỷ Sửu": 
        return "Tích lịch hỏa (lửa sấm sét)";
        case "Canh Dần": 
        case "Tân Mão": 
        return "Tòng bách mộc (cây tòng bách)";
        case "Nhâm Thìn": 
        case "Quý Tỵ":  
        return "Tràng lưu thủy (nước dòng sông)";
        case "Giáp Ngọ": 
        case "Ất Mùi" : 
        return "Sa trung kim (vàng trong cát)";
        case "Bính Thân": 
        case "Đinh Dậu" : 
        return "Sơn hạ hỏa (lửa dưới cát)";
        case "Mậu Tuất": 
        case "Kỷ Hợi": 
        return "Bình địa mộc (cây đồng bằng)";
        case "Canh Tý": 
        case "Tân Sửu": 
        return "Bịch thượng thổ (đất trên vách);"
        case "Nhâm Dần": 
        case "Quý Mão": 
        return "Kim bạch kim (vàng bạch kim)";
        case "Giáp Thìn": 
        case "Ất Tỵ": 
        return "Phú đăng hỏa (lửa ngọn đèn lớn)";
        case "Bính Ngọ": 
        case "Đinh Mùi": 
        return "Thiên thượng thủy (nước trên trời)";
        case "Mậu Thân": 
        case "Kỷ Dậu": 
        return "Đất trach thổ (đất làm nhà)";
        case "Canh Tuất": 
        case "Tân Hợi": 
        return "Xuyến thoa kim (vàng trong tay)";
        case "Nhâm Tý": 
        case "Quý Sửu": 
        return "Tang khô mộc (gỗ cây dâu)";
        case "Giáp Dần": 
        case "Ất Mão": 
        return "Đại khê thủy (nước suối lớn)";
        case "Bính Thìn": 
        case "Đinh Tỵ": 
        return "Sa trung thổ (đất giữa cát)";
        case "Mậu Ngọ": 
        case "Kỷ Mùi": 
        return "Thiên thượng hỏa (lửa trên trời)";
        case "Canh Thân": 
        case "Tân Dậu": 
        return "Thạch lựu mộc (cây thạch lựu)";
        case "Nhâm Tuất": 
        case "Quý Hợi": 
        return "Đại hải thuỷ (nước biển lớn)";
    }
}

function tinhDaiTieu(NamOrNu, Chi, tenCuc)
{
    var index;
    switch(Chi)
    {
        case "Dần":
        case "Ngọ":
        case "Tuất":
        {
            index = 2;
        }break;
        case "Tỵ":
        case "Dậu":
        case "Sửu":
        {
            index = 5;
        }break;
        case "Thân":
        case "Tý":
        case "Thìn":
        {
            index = 8;
        }break;
        case "Hợi":
        case "Mão":
        case "Mùi":
        {
            index = 11;
        }break;
    }

    if(NamOrNu == "Nam")
    {
        for(let i = 0; i < 12; i++)
        {
            let j = i + index;
            let k = i + DiaChi.indexOf(Chi);
            if(j > 11) j = j - 12;
            if(k > 11) k = k - 12;
            document.getElementById(idDaiVan[j].toString()).innerHTML = DiaChi[k].toString();
        }
        document.getElementById("vitrimenh").innerHTML = ViTriMenh;
        if(ViTriMenh%2 === 1) //Nam Dương
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh - i;
                if(j < 0) j = j + 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
        else //Nam Âm
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh + i;
                if(j > 11) j = j - 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
    }
    else if(NamOrNu == "Nữ")
    {
        for(let i = 0; i < 12; i++)
        {
            let j = i + index;
            let k = DiaChi.indexOf(Chi) - i;
            if(j > 11) j = j - 12;
            if(k < 0) k = k + 12;
            document.getElementById(idDaiVan[j].toString()).innerHTML = DiaChi[k].toString();
        }
        if(ViTriMenh%2 === 1) //Nữ Âm
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh + i;
                if(j > 11) j = j - 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
        else //Nữ Dương
        {
            for(let i = 0; i < 12; i++)
            {
                let j = ViTriMenh - i;
                if(j < 0) j = j + 12;
                document.getElementById(idTieuVan[j].toString()).innerHTML = i*10 + Cuc.indexOf(tenCuc) + 2;
            }
        }
    }
}

function timTuVi(ngayCuc, ngaySinh)
{

    for(let i = 0; i < 12; i++)
    {
        const item = ngayCuc[i].slice();
        if(item.indexOf(ngaySinh) > -1)
        {
            return i;
        }
    }
    return -1;
}

function anTuVi(tenCuc, ngaySinh)
{
    let index = -1;
    switch(tenCuc)
    {
        case Cuc[0]:
            index = timTuVi(ngayThuyNhiCuc, ngaySinh);
            break;
        case Cuc[1]:
            index = timTuVi(ngayMocTamCuc, ngaySinh);
            break;
        case Cuc[2]:
            index = timTuVi(ngayKimTuCuc, ngaySinh);
            break;
        case Cuc[3]:
            index = timTuVi(ngayThoNguCuc, ngaySinh);
            break;
        case Cuc[4]:
            index = timTuVi(ngayHoaLucCuc, ngaySinh);
            break;
    }
    const item = AnTuVi[index].slice();
    for(let i = 0; i < 12; i++)
    {
        let id = "AnTuVi" + (i + 1);
        document.getElementById(id).innerHTML = item[i].toString();
    }
}

function anTrangSinh(tenCuc, NamOrNu)
{
    let index = -1;
    switch(tenCuc)
    {
        case Cuc[0]:
            index = 6; //Thân
            break;
        case Cuc[1]:
            index = 9; //Hợi
            break;
        case Cuc[2]:
            index = 3; //Tỵ
            break;
        case Cuc[3]:
            index = 6; //Thân
            break;
        case Cuc[4]:
            index = 0; //Dần
            break;
    }
    if(NamOrNu === "Nam")
    {
        if(ViTriMenh%2 === 1) //Dương Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
        else //Âm Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
    }
    else if(NamOrNu === "Nữ")
    {
        if(ViTriMenh%2 === 1) //Âm nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
        else //Dương Nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnTrangSinh" + (j + 1);
                document.getElementById(id).innerHTML = AnTrangSinh[i].toString();
            }
        }
    }
}

function anThaiTue(tenChi)
{
    let index = DiaChi.indexOf(tenChi) - 2;
    if(index < 0) index = 12 + index;

    for(let i = 0; i < 12; i++)
    {
        let j = index + i;
        if(j > 11) j = j - 12;
        let id = "AnThaiTue" + (j + 1);
        document.getElementById(id).innerHTML = AnThaiTue[i].toString();
    }
}

function anLocTon(tenCan, NamOrNu)
{
    const Can=[0,1,3,4,3,4,6,7,9,10];
    let index = Can[ThienCan.indexOf(tenCan)];
    if(NamOrNu === "Nam")
    {
        if(ViTriMenh%2 === 0) //Dương Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
        else //Âm Nam
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
    }
    else if(NamOrNu === "Nữ")
    {
        if(ViTriMenh%2 === 0) //Âm nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = index - i;
                if(j < 0) j = j + 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
        else //Dương Nữ
        {
            for(let i = 0; i < 12; i++)
            {
                let j = i + index;
                if(j > 11) j = j - 12;
                let id = "AnLocTon" + (j + 1);
                document.getElementById(id).innerHTML = AnLocTon[i].toString();
            }
        }
    }
}