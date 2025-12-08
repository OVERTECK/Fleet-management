using Backend.DataAccess.Entities;

namespace Backend.DataAccess.DTO.Requests;

public class UpdateTripRequest
{
    public required Guid Id { get; set; }

    public required string CarId { get; set; }

    public required Guid DriverId { get; set; }

    public required DateTime TimeStart { get; set; }

    public required DateTime TimeEnd { get; set; }

    public required int TraveledKM  { get; set; }

    public required int ConsumptionLitersFuel { get; set; }

    public required Guid CreatedUserId { get; set; }

    public required List<CreateRouteRequest> Route { get; set; }
}