namespace Backend.DataAccess.DTO.Requests;

public class UpdateTripRequest
{
    public required Guid Id { get; init; }

    public required string CarId { get; init; }

    public required Guid DriverId { get; init; }

    public required DateTime TimeStart { get; init; }

    public required DateTime TimeEnd { get; init; }

    public required int TraveledKM  { get; init; }

    public required int ConsumptionLitersFuel { get; init; }
}