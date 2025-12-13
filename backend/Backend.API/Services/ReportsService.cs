using ClosedXML.Excel;

namespace Backend.API.Services;

public class ReportsService(TripsService tripsService)
{
    /// <summary>
    /// Метод создает и экспортирует поездки в зависимости от роли.
    /// </summary>
    /// <param name="httpContextAccessor"></param>
    /// <returns></returns>
    public async Task<IResult> CreateTripsReport(IHttpContextAccessor httpContextAccessor)
    {
        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Report_Trips");

            var trips = await tripsService.GetAll(httpContextAccessor);

            worksheet.Cell(1, 1).Value = "Id поездки";
            worksheet.Cell(1, 2).Value = "Пробег в км";
            worksheet.Cell(1, 3).Value = "Количество потраченного топлива (литры)";
            worksheet.Cell(1, 4).Value = "Время начала";
            worksheet.Cell(1, 5).Value = "Время конца";
            worksheet.Cell(1, 6).Value = "Id пользователя";
            worksheet.Cell(1, 7).Value = "Id водителя";
            worksheet.Cell(1, 8).Value = "Id машины";

            var counter = 2;

            foreach (var trip in trips)
            {
                worksheet.Cell(counter, 1).Value = trip.Id.ToString();
                worksheet.Cell(counter, 2).Value = trip.TraveledKM;
                worksheet.Cell(counter, 3).Value = trip.ConsumptionLitersFuel;
                worksheet.Cell(counter, 4).Value = trip.TimeStart;
                worksheet.Cell(counter, 5).Value = trip.TimeEnd;
                worksheet.Cell(counter, 6).Value = trip.CreatedUserId.ToString();
                worksheet.Cell(counter, 7).Value = trip.DriverId.ToString();
                worksheet.Cell(counter, 8).Value = trip.CarId;

                counter++;
            }

            worksheet.Columns().AdjustToContents();

            var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var fileName = $"report_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

            return Results.File(stream, contentType, fileName);
        }
    }

    public async Task<IResult> CreateCommnReport(IHttpContextAccessor httpContextAccessor)
    {
        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Report_Trips");

            var trips = await tripsService.GetAll(httpContextAccessor);

            var commonTraveledKm = 0;
            var commonConsumptionLitersFuel = 0;

            worksheet.Cell(1, 1).Value = "Id поездки";
            worksheet.Cell(1, 2).Value = "Пробег в км";
            worksheet.Cell(1, 3).Value = "Потраченного литров топлива";
            worksheet.Cell(1, 4).Value = "Время начала";
            worksheet.Cell(1, 5).Value = "Время конца";
            worksheet.Cell(1, 6).Value = "Id пользователя";
            worksheet.Cell(1, 7).Value = "Id водителя";
            worksheet.Cell(1, 8).Value = "Id машины";

            var counter = 2;

            foreach (var trip in trips)
            {
                commonTraveledKm += trip.TraveledKM;
                commonConsumptionLitersFuel += trip.ConsumptionLitersFuel;

                worksheet.Cell(counter, 1).Value = trip.Id.ToString();
                worksheet.Cell(counter, 2).Value = trip.TraveledKM;
                worksheet.Cell(counter, 3).Value = trip.ConsumptionLitersFuel;
                worksheet.Cell(counter, 4).Value = trip.TimeStart;
                worksheet.Cell(counter, 5).Value = trip.TimeEnd;
                worksheet.Cell(counter, 6).Value = trip.CreatedUserId.ToString();
                worksheet.Cell(counter, 7).Value = trip.DriverId.ToString();
                worksheet.Cell(counter, 8).Value = trip.CarId;

                counter++;
            }

            counter += 2;

            worksheet.Cell(counter, 1).Value = "Общее количество пробега";
            worksheet.Cell(counter + 1, 1).Value = commonTraveledKm;

            worksheet.Cell(counter, 3).Value = "Общее количество затраченного топлива";
            worksheet.Cell(counter + 1, 3).Value = commonConsumptionLitersFuel;

            worksheet.Cell(counter, 5).Value = "Общее количество поездок";
            worksheet.Cell(counter + 1, 5).Value = trips.Count;

            worksheet.Columns().AdjustToContents();

            var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var fileName = $"report_common_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

            return Results.File(stream, contentType, fileName);
        }
    }
}