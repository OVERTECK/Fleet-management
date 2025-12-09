using Backend.API.EndpointsSettings;
using Backend.DataAccess.Entities;
using Backend.DataAccess.Repositories;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Features.Imports;

public class TripsImportsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/import/trips", async (
            TripsImportHandler handler,
            IFormFile file,
            HttpContext httpContext) =>
        {
            return await handler.Handle(file, httpContext);
        }).WithTags("Imports").DisableAntiforgery();
    }
}

sealed class TripsImportHandler(ILogger<TripsImportHandler> logger, TripsRepository tripsRepository)
{
    public async Task<IResult> Handle(IFormFile file, HttpContext httpContext)
    {
        try
        {
            if (file == null)
            {
                throw new NullReferenceException("File not found");
            }

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                using (var workbook = new XLWorkbook(stream))
                {
                    var worksheet = workbook.Worksheet(1);

                    var trips = await this.GetTripsFromExcel(worksheet);

                    await tripsRepository.AddRange(trips);
                }
            }

            return Results.NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);

            return Results.InternalServerError();
        }
    }

    private async Task<List<TripEntity>> GetTripsFromExcel(IXLWorksheet worksheet)
    {
        var trips = new List<TripEntity>();

        var data = worksheet.Cell(1, 1).Value.ToString();

        var counter = 1;

        while (data != string.Empty)
        {
            var traveledKm = worksheet.Cell(counter, 1).Value.ToString().Trim();
            var consumptionLitersFuel = worksheet.Cell(counter, 2).Value.ToString().Trim();
            var timeStart = worksheet.Cell(counter, 3).Value.ToString().Trim();
            var timeEnd = worksheet.Cell(counter, 4).Value.ToString().Trim();
            var createdUserId = Guid.Parse(worksheet.Cell(counter, 5).Value.GetText().Trim());
            var driverId = Guid.Parse(worksheet.Cell(counter, 6).Value.GetText().Trim());
            var carId = worksheet.Cell(counter, 7).Value.ToString().Trim();
            var routes = worksheet.Cell(counter, 8).Value.ToString().Split(";");
            var tripId = Guid.NewGuid();

            var routesEntities = routes.Select((r) => new RouteEntity
            {
                Id = Guid.NewGuid(),
                Latitude = double.Parse(r.Split("!")[0]),
                Longitude = double.Parse(r.Split("!")[1]),
                TripId = tripId,
            }).ToList();

            trips.Add(new TripEntity
            {
                Id = tripId,
                TraveledKM = int.Parse(traveledKm),
                ConsumptionLitersFuel = int.Parse(consumptionLitersFuel),
                TimeStart = DateTime.SpecifyKind(DateTime.Parse(timeStart), DateTimeKind.Utc),
                TimeEnd = DateTime.SpecifyKind(DateTime.Parse(timeEnd), DateTimeKind.Utc),
                CreatedUserId = createdUserId,
                CarId = carId,
                DriverId = driverId,
                Route = routesEntities,
            });

            counter++;
            data = worksheet.Cell(counter, 1).Value.ToString();
        }

        return trips;
    }
}